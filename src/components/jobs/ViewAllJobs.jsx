import { useState } from 'react';

const ViewAllJobs = ({ loadAll, setLoadAll }) => {
  return (
    <section className='flex justify-center my-5'>
      <button
        onClick={() => setLoadAll((prev) => !prev)}
        className='bg-dark text-white text-center py-4 px-24 rounded-xl hover:bg-gray-700 transition duration-300 w-auto'
      >
        {loadAll ? 'Show Recent Jobs' : 'View All Jobs'}
      </button>
    </section>
  );
};

export default ViewAllJobs;
