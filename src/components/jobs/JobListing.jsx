import { useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const JobListing = ({ job }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  let description = job.description;

  if (!showFullDescription) {
    description = description.substring(0, 90) + '...';
  }

  return (
    <div className='bg-white rounded-xl shadow-md flex flex-col h-full p-4'>
      <div className='flex-grow'>
        <div className='mb-6'>
          <div className='text-gray-600 my-2'>{job.type}</div>
          <h3 className='text-xl font-bold'>{job.title}</h3>
        </div>

        <div className='mb-5'>{description}</div>

        <button
          onClick={() => setShowFullDescription((prevState) => !prevState)}
          className='text-indigo-500 hover:text-indigo-600 focus:outline-none mb-4'
        >
          {showFullDescription ? 'Less' : 'More'}
        </button>

        <h3 className='text-indigo-500 mb-2'>{job.salary} / Year</h3>

        <div className='border border-gray-100 mb-5'></div>
        <div className='flex items-center text-orange-700 mb-3'>
          <FaMapMarker className='inline text-lg mr-1' />
          {job.location}
        </div>
      </div>
      <div className='mt-auto flex justify-end w-full'>
        <Link
          to={`/jobs/${job.id}`}
          className='bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-lg text-center text-sm w-full flex items-center justify-center'
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default JobListing;
