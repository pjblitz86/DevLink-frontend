import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../features/alertSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;
  const dispatch = useDispatch();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(showAlert('Passwords do not match', 'danger'));
    } else {
      const newUser = {
        name,
        email,
        password
      };

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const body = JSON.stringify(newUser);
        const res = await axios.post('/api/register', body, config);
        console.log(res.data);
        dispatch(showAlert('User registered successfully', 'success'));
      } catch (err) {
        console.log(err.response.data);
        dispatch(showAlert(err.response.data.msg, 'danger'));
      }
    }
  };

  return (
    <>
      <section className='container'>
        <h1 className='large text-primary'>Register</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Create Your Account
        </p>
        <form className='form' onSubmit={(e) => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Name'
              name='name'
              value={name}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
            <small className='form-text'>
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              minLength='6'
              value={password}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Confirm Password'
              name='password2'
              minLength='6'
              value={password2}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <input type='submit' className='btn btn-primary' value='Register' />
        </form>
        <p className='my-1'>
          Already have an account? <NavLink to='/login'>Login</NavLink>
        </p>
      </section>
    </>
  );
};

export default Register;
