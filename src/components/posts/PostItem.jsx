import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import api from '../../utils/api';
import formatDate from '../../utils/formatDate';
import { deletePost, likePost, unlikePost } from '../../features/postSlice';

const PostItem = ({ post, showActions = true }) => {
  const dispatch = useDispatch();
  const { user: authUser, loading } = useSelector((state) => state.auth);
  const [profileId, setProfileId] = useState(null);

  const {
    id,
    text,
    user,
    name,
    avatar,
    likes = [],
    comments = [],
    date
  } = post;

  useEffect(() => {
    const fetchProfileId = async () => {
      try {
        console.log('Fetching profile for user:', user?.id);
        const res = await api.get(`/profile/${user.id}`);
        if (res.data.data) {
          console.log('Profile ID fetched:', res.data.data.id);
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
    }
  };

  const handleUnlike = () => {
    if (authUser && id) {
      dispatch(unlikePost({ userId: authUser.id, postId: id }));
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id));
    }
  };

  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={profileId ? `/profile/${profileId}` : '#'}>
          <img className='round-img' src={avatar} alt='Avatar' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>Posted on {formatDate(date)}</p>
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
