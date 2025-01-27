import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { deleteExperience } from '../../features/profileSlice';
import formatDate from '../../utils/formatDate';

const Experience = ({ experience }) => {
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      dispatch(deleteExperience(id));
    }
  };

  const renderExperiences = () => {
    if (experience.length === 0) {
      return (
        <tr>
          <td colSpan='4' style={{ textAlign: 'center' }}>
            No experiences added
          </td>
        </tr>
      );
    }

    return experience.map((exp) => (
      <tr key={exp.id}>
        <td>{exp.company}</td>
        <td className='hide-sm'>{exp.title}</td>
        <td>
          {formatDate(exp.startDate)} -{' '}
          {exp.endDate ? formatDate(exp.endDate) : 'Now'}
        </td>
        <td>
          <button
            onClick={() => handleDelete(exp.id)}
            className='btn btn-danger'
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <section>
      <h2 className='my-2'>Experience Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Company</th>
            <th className='hide-sm'>Title</th>
            <th className='hide-sm'>Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{renderExperiences()}</tbody>
      </table>
    </section>
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired
};

export default Experience;
