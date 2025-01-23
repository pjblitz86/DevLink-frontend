import React, { useEffect } from 'react';
import './App.css';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProfileForm from './components/profile-forms/ProfileForm';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import PrivateRoute from './components/auth/PrivateRoute';
import Alert from './layouts/Alert';
import { useDispatch } from 'react-redux';
import { loadUser } from './features/authSlice';
import { logout } from './features/authSlice';
import api from './utils/api';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<LandingPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/register' element={<Register />} />
      <Route
        path='/dashboard'
        element={<PrivateRoute element={<Dashboard />} />}
      />
      <Route path='/create-profile' element={<ProfileForm />} />
      <Route path='/edit-profile' element={<ProfileForm />} />
      <Route path='/add-experience' element={<AddExperience />} />
      <Route path='/add-education' element={<AddEducation />} />
    </Route>
  )
);

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['x-auth-token'] = `Bearer ${token}`;
      dispatch(loadUser());
    }

    const handleStorageChange = () => {
      console.log('Storage changed:', localStorage.getItem('token')); // Debugging
      if (!localStorage.getItem('token')) {
        dispatch(logout());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  return (
    <>
      <Alert />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
};

export default App;
