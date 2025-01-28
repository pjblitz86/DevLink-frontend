import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../../features/postSlice';
import Spinner from '../../layouts/Spinner';
import PostItem from './PostItem';

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return loading ? (
    <Spinner />
  ) : (
    <section className='container'>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome to the DevLink community
      </p>
      {/* PostForm */}
      <div className='posts'>
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default Posts;
