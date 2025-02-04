import { NavLink } from 'react-router-dom';

const Hero = ({
  title = 'Get a Job',
  subtitle = 'Find a developer job that fits your skill set'
}) => {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-16'>
      <div className='text-center'>
        <h1 className='x-large text-white font-normal'>{title}</h1>
        <p className='lead text-white font-light'>{subtitle}</p>
        <div className='buttons'>
          <NavLink to='/jobs' className='btn btn-primary'>
            Jobs
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export default Hero;
