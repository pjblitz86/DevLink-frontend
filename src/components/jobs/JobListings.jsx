import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Spinner from '../../layouts/Spinner';
import JobListing from './JobListing';
import ViewAllJobs from './ViewAllJobs';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadAll, setLoadAll] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      const apiUrl = loadAll ? '/api/jobs' : '/api/jobs?limit=3';
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
  }, [loadAll]);

  return (
    <section className='bg-blue-50 px-4 py-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-indigo-500 mb-6 text-center'>
          {loadAll ? 'Browse All Jobs' : 'Recent Jobs'}
        </h2>

        {loading ? (
          <Spinner />
        ) : error ? (
          <p className='text-center text-red-500 font-semibold'>{error}</p>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {jobs.length > 0 ? (
                jobs.map((job) => <JobListing key={job.id} job={job} />)
              ) : (
                <p className='text-center text-gray-500'>No jobs found.</p>
              )}
            </div>
            <ViewAllJobs loadAll={loadAll} setLoadAll={setLoadAll} />
          </>
        )}
      </div>
    </section>
  );
};

export default JobListings;
