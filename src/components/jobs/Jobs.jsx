import React from 'react';
import JobsCards from './JobsCards';
import JobListings from './JobListings';
import ViewAllJobs from './ViewAllJobs';

const Jobs = () => {
  return (
    <section className='container'>
      <JobsCards />
      <JobListings />
      <ViewAllJobs />
    </section>
  );
};

export default Jobs;
