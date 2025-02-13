import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../features/postSlice';
import { showAlert } from '../../features/alertSlice';

const PostForm = ({ setPosts, posts }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      dispatch(showAlert('You must be logged in to post.', 'danger'));
      return;
    }

    if (!text.trim()) {
      dispatch(showAlert('Post content cannot be empty', 'danger'));
      return;
    }

    const newPostData = {
      userId: user.id,
      formData: { text, name: user.name }
    };

    dispatch(createPost(newPostData))
      .unwrap()
      .then((createdPost) => {
        const postWithAvatar = {
          ...createdPost,
          user: {
            ...createdPost.user,
            avatar: user.avatar
          }
        };

        setPosts([postWithAvatar, ...posts]);
        setText('');
      })
      .catch((error) => {
        console.error('Post creation failed:', error);
        dispatch(showAlert('Failed to create post', 'danger'));
      });
  };

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Say Something...</h3>
      </div>
      <form className='form my-1' onSubmit={handleSubmit}>
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={{ resize: 'none' }}
        />
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

export default PostForm;
