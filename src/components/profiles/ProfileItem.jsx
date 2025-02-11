import React from 'react';
import { Link } from 'react-router-dom';

const ProfileItem = ({
  profile: {
    id,
    user: { name, avatar },
    status,
    company,
    location,
    skills
  }
}) => {
  return (
    <div className='profile bg-light'>
      <img src={avatar} alt={`${name}'s avatar`} className='round-img' />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span> at {company}</span>}
        </p>
        <p className='my-1'>{location && <span>{location}</span>}</p>
        <Link to={`/profile/${id}`} className='btn btn-primary'>
          View Profile
        </Link>
      </div>
      <ul>
        {skills &&
          skills.slice(0, 4).map((skill, index) => (
            <li key={index} className='text-primary'>
              <i className='fas fa-check' /> {skill}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ProfileItem;
