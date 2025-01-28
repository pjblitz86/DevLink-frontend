import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import formatDate from '../../utils/formatDate';
import { deletePost } from '../../features/postSlice';

const PostItem = ({ post }) => {
  const dispatch = useDispatch();
  const { user: authUser, loading } = useSelector((state) => state.auth);

  const { id, text, name, avatar, user, likes, comments, date } = post;

  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>Posted on {formatDate(date)}</p>

        <button
          // onClick={() => dispatch(addLike(id))}
          type='button'
          className='btn btn-light'
        >
          <i className='fas fa-thumbs-up' />{' '}
          <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
        </button>
        <button
          // onClick={() => dispatch(removeLike(id))}
          type='button'
          className='btn btn-light'
        >
          <i className='fas fa-thumbs-down' />
        </button>
        <Link to={`/posts/${id}`} className='btn btn-primary'>
          Discussion{' '}
          {comments.length > 0 && (
            <span className='comment-count'>{comments.length}</span>
          )}
        </Link>
        {!loading && user === authUser?.id && (
          <button
            onClick={() => dispatch(deletePost(id))}
            type='button'
            className='btn btn-danger'
          >
            <i className='fas fa-times' />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostItem;
