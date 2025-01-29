import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../features/postSlice';

const PostForm = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const { user } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to post.');
      return;
    }
    dispatch(createPost({ userId: user.id, formData: { text } }));
    setText('');
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
