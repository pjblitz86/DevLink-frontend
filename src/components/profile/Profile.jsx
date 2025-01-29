import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../../layouts/Spinner';
import { getProfileById, getGithubRepos } from '../../features/profileSlice';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.profile);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProfileById(id));
  }, [getProfileById, id]);

  if (loading) return <Spinner />;

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
            <ProfileExperience />
            <ProfileEducation />
            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default Profile;
