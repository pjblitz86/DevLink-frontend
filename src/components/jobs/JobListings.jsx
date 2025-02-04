import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../layouts/Spinner';
import JobListing from './JobListing';
import ViewAllJobs from './ViewAllJobs';
import { fetchJobs } from '../../features/jobSlice';

const JobListings = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const [loadAll, setLoadAll] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs(loadAll ? null : 3));
  }, [dispatch, loadAll]);

  return (
    <section className='bg-blue-50 px-4 py-4'>
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
