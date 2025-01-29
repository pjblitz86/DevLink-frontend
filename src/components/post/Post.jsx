import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../layouts/Spinner';
import PostItem from '../posts/PostItem';

import { getPostById } from '../../features/postSlice';

const Post = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { post, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <section className='container'>
      <Link to='/posts' className='btn'>
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <div className='comments'>Comments</div>
    </section>
  );
};

export default Post;
