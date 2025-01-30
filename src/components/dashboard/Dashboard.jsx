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
  const {
    profile,
    loading: profileLoading,
    profileChecked
  } = useSelector((state) => state.profile);
  const {
    user,
    isAuthenticated,
    loading: authLoading
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!profileChecked) {
      dispatch(getCurrentUserProfile());
    }
  }, [dispatch, profileChecked]);

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
      const userId = user?.id;
      if (!userId) {
        console.error('User ID is missing. Cannot delete account.');
        return;
      }
      await dispatch(deleteAccount(userId)).unwrap();
      navigate('/');
    }
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome,{' '}
        {isAuthenticated && user ? user.name : 'User'}
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
              <i className='fas fa-user' /> Delete Profile
            </button>
          </div>
          <div className='my-2'>
            <button className='btn btn-danger' onClick={handleDeleteAccount}>
              <i className='fas fa-user-minus' /> Delete Account
            </button>
          </div>
        </>
      ) : (
        <>
          <div className='buttons'>
            <Link to='/create-profile' className='btn btn-primary my-1'>
              Create Profile
            </Link>
            <button
              className='btn btn-danger my-1'
              onClick={handleDeleteAccount}
            >
              <i className='fas fa-user-minus' /> Delete Account
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Dashboard;
