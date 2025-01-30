import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { deleteEducation } from '../../features/profileSlice';
import formatDate from '../../utils/formatDate';

const Education = ({ education }) => {
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this education?')) {
      dispatch(deleteEducation(id));
    }
  };

  const renderEducations = () => {
    if (education.length === 0) {
      return (
        <tr>
          <td colSpan='4' style={{ textAlign: 'center' }}>
            No educations added
          </td>
        </tr>
      );
    }

    return education.map((edu) => (
      <tr key={edu.id}>
        <td>{edu.school}</td>
        <td className='hide-sm'>{edu.degree}</td>
        <td>
          {formatDate(edu.startDate)} -{' '}
          {edu.endDate ? formatDate(edu.endDate) : 'Now'}
        </td>
        <td>
          <button
            onClick={() => handleDelete(edu.id)}
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
      <h2 className='my-2'>Education</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hide-sm'>Degree</th>
            <th className='hide-sm'>Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{renderEducations()}</tbody>
      </table>
    </section>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired
};

export default Education;
