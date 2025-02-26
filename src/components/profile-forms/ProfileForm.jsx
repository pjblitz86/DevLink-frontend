import React, { useState, useEffect } from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import normalizeUrl from 'normalize-url';
import {
  createOrUpdateProfile,
  getCurrentUserProfile
} from '../../features/profileSlice';

const initialState = {
  company: '',
  website: '',
  location: '',
  status: '',
  skills: '',
  githubusername: '',
  bio: '',
  twitter: '',
  facebook: '',
  linkedin: '',
  youtube: '',
  instagram: ''
};

const CreateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const creatingProfile = useMatch('/create-profile');
  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const { profile } = useSelector((state) => state.profile);
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!profile) {
      dispatch(getCurrentUserProfile());
    } else if (profile) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      if (Array.isArray(profile.skills)) {
        profileData.skills = profile.skills.join(', ');
      }
      setFormData(profileData);
    }
  }, [dispatch, profile]);

  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const normalizeSocialUrl = (url) => {
    if (!url) return '';
    try {
      return normalizeUrl(url, { forceHttps: true, stripWWW: false });
    } catch (error) {
      return url;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const editing = !!profile;

    const sanitizedFormData = {
      ...formData,
      website: normalizeSocialUrl(website),
      twitter: normalizeSocialUrl(twitter),
      facebook: normalizeSocialUrl(facebook),
      linkedin: normalizeSocialUrl(linkedin),
      youtube: normalizeSocialUrl(youtube),
      instagram: normalizeSocialUrl(instagram)
    };

    try {
      await dispatch(
        createOrUpdateProfile({ formData: sanitizedFormData, edit: editing })
      ).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating/updating profile:', err);
    }
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>
        {creatingProfile ? 'Create Your Profile' : 'Edit Your Profile'}
      </h1>
      <p className='lead'>
        <i className='fas fa-user' />
        {creatingProfile
          ? ` Let's get some information to make your profile stand out`
          : ' Add some changes to your profile'}
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <select name='status' value={status} onChange={onChange}>
            <option value='0'>* Select Professional Status</option>
            <option value='Developer'>Developer</option>
            <option value='Junior Developer'>Junior Developer</option>
            <option value='Senior Developer'>Senior Developer</option>
            <option value='Manager'>Manager</option>
            <option value='Student or Learning'>Student or Learning</option>
            <option value='Instructor'>Instructor or Teacher</option>
            <option value='Intern'>Intern</option>
            <option value='Other'>Other</option>
          </select>
          <small className='form-text'>
            Give us an idea of where you are at in your career
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Company'
            name='company'
            value={company}
            onChange={onChange}
          />
          <small className='form-text'>
            Could be your own company or one you work for
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Website'
            name='website'
            value={website}
            onChange={onChange}
          />
          <small className='form-text'>
            Could be your own or a company website
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Location'
            name='location'
            value={location}
            onChange={onChange}
          />
          <small className='form-text'>
            City & state suggested (eg. Boston, MA)
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Skills'
            name='skills'
            value={skills}
            onChange={onChange}
          />
          <small className='form-text'>
            Please use comma-separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Github Username'
            name='githubusername'
            value={githubusername}
            onChange={onChange}
          />
          <small className='form-text'>
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>
        <div className='form-group'>
          <textarea
            placeholder='A short bio of yourself'
            name='bio'
            value={bio}
            onChange={onChange}
          />
          <small className='form-text'>Tell us a little about yourself</small>
        </div>

        <div className='my-2'>
          <button
            onClick={() => toggleSocialInputs((prev) => !prev)}
            type='button'
            className='btn btn-light'
          >
            {displaySocialInputs
              ? 'Hide Social Network Links'
              : 'Add Social Network Links'}
          </button>
          <span>Optional</span>
        </div>

        {displaySocialInputs && (
          <>
            <div className='form-group social-input'>
              <i className='fab fa-twitter fa-2x' />
              <input
                type='text'
                placeholder='Twitter URL'
                name='twitter'
                value={twitter}
                onChange={onChange}
              />
            </div>
            <div className='form-group social-input'>
              <i className='fab fa-facebook fa-2x' />
              <input
                type='text'
                placeholder='Facebook URL'
                name='facebook'
                value={facebook}
                onChange={onChange}
              />
            </div>
            <div className='form-group social-input'>
              <i className='fab fa-youtube fa-2x' />
              <input
                type='text'
                placeholder='YouTube URL'
                name='youtube'
                value={youtube}
                onChange={onChange}
              />
            </div>
            <div className='form-group social-input'>
              <i className='fab fa-linkedin fa-2x' />
              <input
                type='text'
                placeholder='Linkedin URL'
                name='linkedin'
                value={linkedin}
                onChange={onChange}
              />
            </div>
            <div className='form-group social-input'>
              <i className='fab fa-instagram fa-2x' />
              <input
                type='text'
                placeholder='Instagram URL'
                name='instagram'
                value={instagram}
                onChange={onChange}
              />
            </div>
          </>
        )}

        <input
          type='submit'
          className='btn btn-primary my-1'
          value={creatingProfile ? 'Create Profile' : 'Save Changes'}
        />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Go Back
        </Link>
      </form>
    </section>
  );
};

export default CreateProfile;
