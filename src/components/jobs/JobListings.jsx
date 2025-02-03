import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Spinner from '../../layouts/Spinner';
import JobListing from './JobListing';

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const apiUrl = isHome ? '/api/jobs?limit=3' : '/api/jobs';
      try {
        const res = await api.get(apiUrl);
        setJobs(res.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isHome]);

  return (
    <section className='bg-blue-50 px-4 py-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-indigo-500 mb-6 text-center'>
          {isHome ? 'Recent Jobs' : 'Browse Jobs'}
        </h2>

        {loading ? (
          <Spinner loading={loading} />
        ) : error ? (
          <p className='text-center text-red-500 font-semibold'>{error}</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {jobs.length > 0 ? (
              jobs.map((job) => <JobListing key={job.id} job={job} />)
            ) : (
              <p className='text-center text-gray-500'>No jobs found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
