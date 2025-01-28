import React from 'react';
import { useSelector } from 'react-redux';

const ProfileAbout = () => {
  const { profile } = useSelector((state) => state.profile);

  if (!profile) return null;

  const { bio, skills, user } = profile;
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  // Ensure skills is always an array
  const skillsArray = Array.isArray(skills)
    ? skills
    : skills?.split(',').map((skill) => skill.trim()) || [];

  return (
    <div className='profile-about bg-light p-2'>
      {bio && (
        <>
          <h2 className='text-primary'>{firstName}'s Bio</h2>
          <p>{bio}</p>
          <div className='line' />
        </>
      )}
      <h2 className='text-primary'>Skill Set</h2>
      <div className='skills'>
        {skillsArray.length > 0 ? (
          skillsArray.map((skill, index) => (
            <div key={index} className='p-1'>
              <i className='fas fa-check' /> {skill}
            </div>
          ))
        ) : (
          <p>No skills listed.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileAbout;
