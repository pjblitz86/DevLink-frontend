import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <NavLink to='/'>
          <i className='fas fa-code'></i> DevLink
        </NavLink>
      </h1>
      <ul>
        <li>
          <NavLink to='/profiles'>Developers</NavLink>
        </li>
        <li>
          <NavLink to='/dashboard'>
            <i className='fas fa-user' />{' '}
            <span className='hide-sm'>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to='/register'>Register</NavLink>
        </li>
        <li>
          <NavLink to='/login'>Login</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
