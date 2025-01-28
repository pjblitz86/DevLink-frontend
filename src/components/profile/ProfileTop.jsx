import React from 'react';
import { useSelector } from 'react-redux';

const ProfileTop = () => {
  const { profile } = useSelector((state) => state.profile);

  if (!profile) return null;

  const {
    status,
    company,
    location,
    website,
    githubusername,
    user: { name, avatar },
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram
  } = profile;

  return (
    <div className='profile-top bg-primary p-2'>
      <img className='round-img my-1' src={avatar} alt={`${name}'s avatar`} />
      <h1 className='large'>{name}</h1>
      <p className='lead'>
        {status} {company && <span>at {company}</span>}
      </p>
      {location && <p>{location}</p>}
      <div className='icons my-1'>
        {website && (
          <a href={website} target='_blank' rel='noopener noreferrer'>
            <i className='fas fa-globe fa-2x'></i>
          </a>
        )}
        {githubusername && (
          <a
            href={`https://github.com/${githubusername}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <i className='fab fa-github fa-2x'></i>
          </a>
        )}
        {twitter && (
          <a href={twitter} target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-twitter fa-2x'></i>
          </a>
        )}
        {facebook && (
          <a href={facebook} target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-facebook fa-2x'></i>
          </a>
        )}
        {linkedin && (
          <a href={linkedin} target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-linkedin fa-2x'></i>
          </a>
        )}
        {youtube && (
          <a href={youtube} target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-youtube fa-2x'></i>
          </a>
        )}
        {instagram && (
          <a href={instagram} target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-instagram fa-2x'></i>
          </a>
        )}
      </div>
    </div>
  );
};

export default ProfileTop;
