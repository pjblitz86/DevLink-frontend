import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../layouts/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { getPostById } from '../../features/postSlice';

const Post = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { post, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (post?.id) {
      dispatch(getPostById(id));
      console.log('rerender');
    }
  }, [dispatch, id, post?.comments.length]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <section className='container'>
      <Link to='/posts' className='btn'>
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post.id} />
      <div className='comments'>
        {post.comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={post.id} />
        ))}
      </div>
    </section>
  );
};

export default Post;
