import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { showAlert } from '../../features/alertSlice';
import Card from './Card';

const JobsCards = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleAddJobClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      dispatch(showAlert('You must log in first to add a job', 'danger'));
    }
  };

  return (
    <section className='py-4'>
      <div className='container-xl lg:container m-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
          <Card>
            <h2 className='text-2xl font-bold'>For Developers</h2>
            <p className='mt-2 mb-4'>
              Browse our developer jobs and start your career today
            </p>
            <Link
              to='/jobs'
              className='inline-block bg-dark text-white text-lg font-medium rounded-lg px-6 py-1 w-auto min-w-[150px] text-center hover:bg-gray-700 transition duration-200'
            >
              Browse Jobs
            </Link>
          </Card>
          <Card bg='bg-indigo-100'>
            <h2 className='text-2xl font-bold'>For Employers</h2>
            <p className='mt-2 mb-4'>
              List your job to find the perfect developer for the role
            </p>
            <Link
              to={isAuthenticated ? '/add-job' : '#'}
              onClick={handleAddJobClick}
              className='inline-block bg-primary text-white text-lg font-medium rounded-lg px-6 py-1 w-auto min-w-[150px] text-center hover:bg-indigo-600 transition duration-200'
            >
              Add Job
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default JobsCards;
