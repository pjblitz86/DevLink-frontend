const Hero = ({
  title = 'Become a React Dev',
  subtitle = 'Find the React job that fits your skill set'
}) => {
  return (
    // <section className='bg-indigo-700 py-20 mb-4'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-16'>
      <div className='text-center'>
        <h1 className='x-large text-white font-normal'>{title}</h1>
        <p className='lead text-white font-light'>{subtitle}</p>
      </div>
    </div>
    // </section>
  );
};
export default Hero;
