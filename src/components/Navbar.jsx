import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles' className={isActive('/profiles')}>
          Developers
        </Link>
      </li>
      <li>
        <Link to='/jobs' className={isActive('/jobs')}>
          Jobs
        </Link>
      </li>
      <li>
        <Link to='/posts' className={isActive('/posts')}>
          Posts
        </Link>
      </li>
      <li>
        <Link to='/dashboard' className={isActive('/dashboard')}>
          <i className='fas fa-user' />{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={handleLogout} href='#!'>
          <i className='fas fa-sign-out-alt' />{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles' className={isActive('/profiles')}>
          Developers
        </Link>
      </li>
      <li>
        <Link to='/jobs' className={isActive('/jobs')}>
          Jobs
        </Link>
      </li>
      <li>
        <Link to='/register' className={isActive('/register')}>
          Register
        </Link>
      </li>
      <li>
        <Link to='/login' className={isActive('/login')}>
          Login
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code' /> DevLink
        </Link>
      </h1>
      <>{isAuthenticated ? authLinks : guestLinks}</>
    </nav>
  );
};

export default Navbar;
