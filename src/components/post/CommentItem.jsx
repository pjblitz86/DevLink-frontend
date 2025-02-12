import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import formatDateMinSec from '../../utils/formatDateMinSec';
import { deleteComment, getPostById } from '../../features/postSlice';
import { getProfiles } from '../../features/profileSlice';

const CommentItem = ({ comment, postId }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { id, text, name, avatar, date } = comment;
  const { profiles } = useSelector((state) => state.profile);

  useEffect(() => {
    if (!profiles || profiles.length === 0) {
      dispatch(getProfiles());
    }
  }, [dispatch, profiles]);

  const profile = profiles?.find(
    (p) => p.user?.name.trim().toLowerCase() === name.trim().toLowerCase()
  );
  const profileId = profile?.id || null;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await dispatch(deleteComment(id));
      dispatch(getPostById(postId));
    }
  };

  return (
    <div className='post bg-white p-1 my-1'>
      <div className='flex flex-col items-center'>
        <Link to={profileId ? `/profile/${profileId}` : '#'}>
          <img className='round-img' src={avatar} alt='' />
          <h4 className='mt-2 text-center text-blue-600 hover:underline'>
            {name}
          </h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>Posted on {formatDateMinSec(date)}</p>
        {!loading && user?.name === name && (
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
