import React from 'react';
import { useSelector } from 'react-redux';
import formatDate from '../../utils/formatDate';

const ProfileEducation = () => {
  const { profile } = useSelector((state) => state.profile);

  if (!profile) return null;

  const educations = Array.isArray(profile.educations)
    ? profile.educations
    : [];

  return (
    <div className='profile-edu bg-white p-2'>
      <h2 className='text-primary'>Education</h2>
      {educations.length === 0 ? (
        <p className='no-credentials'>No education credentials</p>
      ) : (
        educations.map(
          ({
            id,
            school,
            degree,
            fieldOfStudy,
            startDate,
            endDate,
            description
          }) => (
            <div key={id} className='education-item'>
              <h3 className='text-dark'>{school || 'Unknown Institution'}</h3>
              <p>
                {formatDate(startDate)} -{' '}
                {endDate ? formatDate(endDate) : 'Now'}
              </p>
              <p>
                <strong>Degree: </strong> {degree || 'Not specified'}
              </p>
              <p>
                <strong>Field Of Study: </strong>{' '}
                {fieldOfStudy || 'Not specified'}
              </p>
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

export default ProfileEducation;
