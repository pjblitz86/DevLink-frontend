import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardActions from './DashboardActions';
import {
  getCurrentUserProfile,
  deleteAccount
} from '../../features/profileSlice';
import Spinner from '../../layouts/Spinner';
import Experience from './Experience';
import Education from './Education';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { profile, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUserProfile());
  }, [dispatch]);

  console.log('Dashboard:', { profileLoading, authLoading });
  if (profileLoading || authLoading) return <Spinner />;

  return (
    <section className='container'>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome, {user?.name || 'User'}
      </p>
      {profile ? (
        <>
          <DashboardActions />
          <Experience experience={profile.experiences || []} />
          <Education education={profile.educations || []} />
          <div className='my-2'>
            <button
              className='btn btn-danger'
              onClick={() => dispatch(deleteAccount())}
            >
              <i className='fas fa-user-minus' /> Delete My Account
            </button>
          </div>
        </>
      ) : (
        <>
          <p>You have not yet set up a profile, please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </>
      )}
    </section>
  );
};

export default Dashboard;
