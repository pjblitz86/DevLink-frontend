import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardActions from './DashboardActions';
import {
  clearProfile,
  getCurrentUserProfile,
  deleteProfile,
  deleteAccount,
  uploadAvatar
} from '../../features/profileSlice';
import Spinner from '../../layouts/Spinner';
import Experience from './Experience';
import Education from './Education';
import { showAlert } from '../../features/alertSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const {
    user,
    isAuthenticated,
    loading: authLoading
  } = useSelector((state) => state.auth);
  const [avatar, setAvatar] = useState(user?.avatar || '');

  useEffect(() => {
    if (profile && profile.user && user && profile.user.id !== user.id) {
      dispatch(clearProfile());
    }
  }, [dispatch, user, profile]);

  useEffect(() => {
    dispatch(getCurrentUserProfile());
  }, [dispatch]);

  if (profileLoading || authLoading) return <Spinner />;

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 500 * 1024) {
        dispatch(showAlert('File size must be under 500KB', 'danger'));
        return;
      }

      dispatch(uploadAvatar({ userId: user.id, file }))
        .unwrap()
        .then((avatarUrl) => {
          setAvatar(avatarUrl);
        })
        .catch((error) => {
          console.error('Upload failed:', error);
        });
    }
  };

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
          <div className='relative inline-block cursor-pointer'>
            <label htmlFor='avatarUpload'>
              <img
                src={avatar}
                alt={`${user.name}'s avatar`}
                className='w-40 h-40 rounded-full object-cover border border-gray-300'
              />
              <div className='absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full text-[10px] cursor-pointer hover:bg-gray-700 transition'>
                <i className='fas fa-camera text-[14px]'></i>
              </div>
            </label>
            <input
              type='file'
              id='avatarUpload'
              accept='image/*'
              className='hidden'
              onChange={handleFileChange}
            />
          </div>
          <DashboardActions />
          <Experience experience={profile.experiences || []} />
          <Education education={profile.educations || []} />
          <section>
            <h2 className='mb-4 mt-4 text-2xl font-bold border-b-2 border-gray-300 pb-1 text-gray-800'>
              Danger Zone
            </h2>
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
