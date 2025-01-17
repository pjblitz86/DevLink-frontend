import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = (props) => {
  // TODO: add spinner if no profile and loading
  return (
    <section className='container'>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        {/* TODO: get user from db */}
        <i className='fas fa-user' /> Welcome, user placeholder
      </p>
      {/* Add later profile !== null ? and full profile once auth is done */}
      <>
        <p>You have not yet setup a profile, please add some info</p>
        <Link to='/create-profile' className='btn btn-primary my-1'>
          Create Profile
        </Link>
      </>
    </section>
  );
};

export default Dashboard;
