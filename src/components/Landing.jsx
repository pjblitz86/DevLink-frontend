import React from 'react';
import { NavLink } from 'react-router-dom';

const Landing = () => {
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Developer Link</h1>
          <p className='lead'>
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className='buttons'>
            <NavLink to='/register' className='btn btn-primary'>
              Register
            </NavLink>
            <NavLink to='/login' className='btn btn-light'>
              Login
            </NavLink>
            <NavLink to='/profiles' className='btn btn-primary'>
              Developers
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
