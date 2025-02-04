import React, { useState } from 'react';
import JobsCards from './JobsCards';
import JobListings from './JobListings';

const Jobs = () => {
  return (
    <section className='container'>
      <JobsCards />
      <JobListings />
    </section>
  );
};

export default Jobs;
