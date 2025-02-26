import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Spinner from '../../layouts/Spinner';
import { showAlert } from '../../features/alertSlice';
import { deleteJob, fetchJobById, fetchJobs } from '../../features/jobSlice';
import { loadUser } from '../../features/authSlice';

const Job = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isJobOwner, setIsJobOwner] = useState(false);
  const { job, loading, error } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchJobData = async () => {
      await dispatch(fetchJobById(id)).unwrap();
      if (!user) {
        dispatch(loadUser());
      }
    };

    fetchJobData();
  }, [id, dispatch, user]);

  useEffect(() => {
    if (job && user?.jobs) {
      const isOwner = user.jobs.some((j) => j.id === job.id);
      setIsJobOwner(isOwner);
    }
  }, [job, user]);

  if (loading) return <Spinner />;
  if (!job || error)
    return (
      <p className='text-center text-red-500'>
        Job not found or failed to load.
      </p>
    );

  const onDeleteClick = async (jobId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this job?'
    );

    if (!confirmDelete) return;

    try {
      await dispatch(deleteJob(jobId)).unwrap();
      navigate('/jobs');
      dispatch(showAlert('Job deleted successfully', 'success'));
    } catch (error) {
      console.error('Error deleting job:', error);
      dispatch(showAlert(error || 'Failed to delete job', 'danger'));
    }
  };

  return (
    <>
      <section className='container bg-indigo-50 m-auto'>
        <section className='container my-2'>
          <Link
            to='/jobs'
            className='text-indigo-500 hover:text-indigo-600 flex items-center'
          >
            <FaArrowLeft className='mr-2' /> Back To Jobs
          </Link>
        </section>
        <div className='py-4 px-2 m-4'>
          <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
            <main>
              <div className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
                <div className='text-gray-500 mb-4'>{job.type}</div>
                <h1 className='text-3xl font-bold mb-4'>{job.title}</h1>
                <div className='text-gray-500 mb-4 flex align-middle justify-center md:justify-start'>
                  <FaMapMarker className='text-orange-700 mr-1' />
                  <p className='text-orange-700'>{job.location}</p>
                </div>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
                <h3 className='text-indigo-800 text-lg font-bold mb-6'>
                  Job Description
                </h3>

                <p className='mb-4'>{job.description}</p>

                <h3 className='text-indigo-800 text-lg font-bold mb-2'>
                  Salary
                </h3>

                <p className='mb-4'>{job.salary} / Year</p>
              </div>
            </main>

            {/* <!-- Sidebar --> */}
            <aside>
              <div className='bg-white p-6 rounded-lg shadow-md'>
                <h3 className='text-xl font-bold mb-6'>Company Info</h3>

                <h2 className='text-2xl'>{job.company.name}</h2>

                <p className='my-2'>{job.company.description}</p>

                <hr className='my-4' />

                <h3 className='text-xl'>Contact Email:</h3>

                <p className='my-1 bg-indigo-100 p-1 text-sm font-bold h-10 flex items-center justify-center'>
                  {job.company.contactEmail}
                </p>

                <h3 className='text-xl'>Contact Phone:</h3>

                <p className='my-1 bg-indigo-100 p-1 text-sm font-bold h-8 flex items-center justify-center'>
                  {' '}
                  {job.company.contactPhone}
                </p>
              </div>
              {isJobOwner && (
                <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
                  <h3 className='text-xl font-bold mb-6'>Manage Job</h3>
                  <Link
                    to={`/edit-job/${job.id}`}
                    className='bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-1 px-3 rounded-full w-full focus:outline-none focus:shadow-outline text-sm h-10 flex items-center justify-center'
                  >
                    Edit Job
                  </Link>
                  <button
                    onClick={() => onDeleteClick(job.id)}
                    className='bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full w-full focus:outline-none focus:shadow-outline mt-3 text-sm h-10 flex items-center justify-center'
                  >
                    Delete Job
                  </button>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default Job;
