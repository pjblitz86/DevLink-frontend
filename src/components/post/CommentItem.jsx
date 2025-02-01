import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import formatDateMinSec from '../../utils/formatDateMinSec';
import { deleteComment } from '../../features/postSlice';

const CommentItem = ({ postId, comment }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { id, text, name, avatar, post, date } = comment;
  const { profiles } = useSelector((state) => state.profile);

  const profile = profiles?.find((p) => p.user?.name === name);
  const profileId = profile?.id;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment({ postId, commentId: id }));
    }
  };

  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={profileId ? `/profile/${profileId}` : '#'}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>Posted on {formatDateMinSec(date)}</p>
        {!loading && user?.id === post?.user?.id && (
          <button
            onClick={handleDelete}
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

export default CommentItem;
