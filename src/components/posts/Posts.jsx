import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../../features/postSlice';
import Spinner from '../../layouts/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';

const Posts = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.post);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    dispatch(getPosts())
      .unwrap()
      .then((fetchedPosts) => {
        setPosts(fetchedPosts);
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, [dispatch]);

  return loading ? (
    <Spinner />
  ) : (
    <section className='container'>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome to the DevLink community
      </p>
      <PostForm setPosts={setPosts} posts={posts} />
      <div className='posts'>
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => <PostItem key={post.id} post={post} />)
        ) : (
          <h4>No posts found...</h4>
        )}
      </div>
    </section>
  );
};

export default Posts;
