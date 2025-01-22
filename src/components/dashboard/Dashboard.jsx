import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardActions from './DashboardActions';
import { getCurrentUserProfile } from '../../features/profileSlice';
import Spinner from '../../layouts/Spinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getCurrentUserProfile());
  }, [dispatch]);

  if (loading) return <Spinner />;

  return (
    <section className='container'>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        {/* TODO: get user from db */}
        <i className='fas fa-user' /> Welcome, user placeholder
      </p>
      <>
        <DashboardActions />
        <p>You have not yet setup a profile, please add some info</p>
        <Link to='/create-profile' className='btn btn-primary my-1'>
          Create Profile
        </Link>
      </>
    </section>
  );
};

export default Dashboard;
