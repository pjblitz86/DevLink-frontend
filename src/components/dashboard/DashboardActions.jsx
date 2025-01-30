import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const DashboardActions = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);

  return (
    <div className='dash-buttons'>
      {profile && (
        <Link to={`/profile/${profile.id}`} className='btn btn-light'>
          <i className='fas fa-user text-primary'></i> View Profile
        </Link>
      )}
      <Link to='/edit-profile' className='btn btn-light'>
        <i className='fas fa-user-circle text-primary'></i> Edit Profile
      </Link>
      <Link to='/add-experience' className='btn btn-light'>
        <i className='fab fa-black-tie text-primary'></i> Add Experience
      </Link>
      <Link to='/add-education' className='btn btn-light'>
        <i className='fas fa-graduation-cap text-primary'></i> Add Education
      </Link>
    </div>
  );
};

export default DashboardActions;
