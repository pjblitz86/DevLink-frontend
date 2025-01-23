import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../../layouts/Spinner';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  console.log('PrivateRoute:', { isAuthenticated, loading });
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to='/login' />;

  return element;
};

export default PrivateRoute;
