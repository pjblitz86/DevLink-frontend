import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../utils/api';
import formatDateMinSec from '../../utils/formatDateMinSec';
import { deletePost, likePost, unlikePost } from '../../features/postSlice';

const PostItem = ({ post, showActions = true, setPosts, posts }) => {
  const dispatch = useDispatch();
  const { user: authUser, loading } = useSelector((state) => state.auth);
  const [profileId, setProfileId] = useState(null);
  const { id, text, user, name, likes = [], comments = [], date } = post;

  useEffect(() => {
    const fetchProfileId = async () => {
      try {
        const res = await api.get(`/profiles/user/${user.id}`);
        if (res.data.data) {
          setProfileId(res.data.data.id);
        }
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error);
      }
    };

    if (user?.id) {
      fetchProfileId();
    }
  }, [user]);

  const handleLike = () => {
    if (authUser && id) {
      dispatch(likePost({ userId: authUser.id, postId: id }));
    } else {
      console.error('Like failed: Missing user or post ID');
    }
  };

  const handleUnlike = () => {
    if (authUser && id) {
      dispatch(unlikePost({ userId: authUser.id, postId: id }));
    } else {
      console.error('Unlike failed: Missing user or post ID');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost({ postId: id, userId: authUser.id })).unwrap();
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  return (
    <div className='post bg-white p-1 my-1'>
      <div className='flex flex-col items-center'>
        <Link to={profileId ? `/profile/${profileId}` : '#'}>
          <img className='round-img' src={user.avatar} alt='Avatar' />
          <h4 className='mt-2 text-center text-blue-600 hover:underline'>
            {name}
          </h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>Posted on {formatDateMinSec(date)}</p>
        {showActions && (
          <>
            <button
              onClick={handleLike}
              type='button'
              className='btn btn-light'
            >
              <i className='fas fa-thumbs-up' />{' '}
              {likes?.length > 0 && <span>{likes.length}</span>}
            </button>
            <button
              onClick={handleUnlike}
              type='button'
              className='btn btn-light'
            >
              <i className='fas fa-thumbs-down' />
            </button>
            <Link to={`/post/${id}`} className='btn btn-primary'>
              Discussion{' '}
              {comments?.length > 0 && (
                <span className='comment-count'>{comments.length}</span>
              )}
            </Link>
            {!loading && authUser?.id === user.id && (
              <button
                onClick={handleDelete}
                type='button'
                className='btn btn-danger'
              >
                <i className='fas fa-times' />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostItem;
