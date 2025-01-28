import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../../layouts/Spinner';
import { getProfileById } from '../../features/profileSlice';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.profile);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProfileById(id));
  }, [dispatch, id]);

  return (
    <section className='container'>
      {loading || profile === null ? (
        <Spinner />
      ) : (
        <>
          <Link to='/profiles' className='btn btn-light'>
            Back To Profiles
          </Link>
          {isAuthenticated && user && user.id === profile.user.id && (
            <Link to='/edit-profile' className='btn btn-dark'>
              Edit Profile
            </Link>
          )}
          <div className='profile-grid my-1'>
            <ProfileTop />
            <ProfileAbout />
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experience</h2>
            </div>
            <div className='profile-edu bg-white p-2'>Education</div>
            Github
          </div>
        </>
      )}
    </section>
  );
};

export default Profile;
