import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardActions from './DashboardActions';
import {
  getCurrentUserProfile,
  deleteProfile,
  deleteAccount
} from '../../features/profileSlice';
import Spinner from '../../layouts/Spinner';
import Experience from './Experience';
import Education from './Education';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUserProfile());
  }, [dispatch]);

  console.log('Dashboard:', { profileLoading, authLoading });
  if (profileLoading || authLoading) return <Spinner />;

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      dispatch(deleteProfile(profile.id));
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action is irreversible.'
      )
    ) {
      await dispatch(deleteAccount(profile.id)).unwrap();
      navigate('/');
    }
  };

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
          <section>
            <h2 className='my-2'>Danger Zone</h2>
          </section>
          <div className='my-2'>
            <button className='btn btn-danger' onClick={handleDeleteProfile}>
              <i className='fas fa-user' /> Delete My Profile
            </button>
          </div>
          <div className='my-2'>
            <button className='btn btn-danger' onClick={handleDeleteAccount}>
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
