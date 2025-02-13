import React, { useEffect, useState } from 'react';
import Spinner from '../../layouts/Spinner';
import axios from 'axios';

const ProfileGithub = ({ username }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const githubProfileUrl = `https://github.com/${username}`;

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axios.get(
          `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`
        );
        setRepos(res.data);
      } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchRepos();
    }
  }, [username]);

  return (
    <div className='profile-github'>
      <h2 className='text-primary my-1'>
        <a
          href={githubProfileUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary hover:underline'
        >
          Github Repos
        </a>
      </h2>

      {loading ? (
        <Spinner />
      ) : repos.length > 0 ? (
        repos.map((repo) => (
          <div key={repo.id} className='repo bg-white p-1 my-1'>
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className='badge badge-primary'>
                  Stars: {repo.stargazers_count}
                </li>
                <li className='badge badge-dark'>
                  Watchers: {repo.watchers_count}
                </li>
                <li className='badge badge-light'>Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p className='no-credentials'>No GitHub repositories found</p>
      )}
    </div>
  );
};

export default ProfileGithub;
