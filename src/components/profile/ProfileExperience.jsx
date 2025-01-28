import React from 'react';
import { useSelector } from 'react-redux';
import formatDate from '../../utils/formatDate';

const ProfileExperience = () => {
  const { profile } = useSelector((state) => state.profile);

  if (!profile) return null;

  const experiences = Array.isArray(profile.experiences)
    ? profile.experiences
    : [];

  return (
    <div className='profile-exp bg-white p-2'>
      <h2 className='text-primary'>Experience</h2>
      {experiences.length === 0 ? (
        <p className='no-credentials'>No experience credentials</p>
      ) : (
        experiences.map(
          ({
            id,
            title,
            company,
            location,
            startDate,
            endDate,
            description
          }) => (
            <div key={id} className='experience-item'>
              <h3 className='text-dark'>{company || 'Unknown Company'}</h3>
              <p>
                {formatDate(startDate)} -{' '}
                {endDate ? formatDate(endDate) : 'Now'}
              </p>
              <p>
                <strong>Position: </strong> {title || 'Not specified'}
              </p>
              {location && (
                <p>
                  <strong>Location: </strong> {location}
                </p>
              )}
              {description && (
                <p>
                  <strong>Description: </strong> {description}
                </p>
              )}
            </div>
          )
        )
      )}
    </div>
  );
};

export default ProfileExperience;
