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
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import Alert from './layouts/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, logout } from './features/authSlice';
import api from './utils/api';
import JobsPage from './pages/JobsPage';
import Job from './components/jobs/Job';
import NotFoundPage from './pages/NotFoundPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<LandingPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/profiles' element={<Profiles />} />
      <Route path='/jobs' element={<JobsPage />} />
      <Route path='/jobs/:id' element={<Job />} />
      <Route path='*' element={<NotFoundPage />} />
      <Route path='profile/:id' element={<Profile />} />
      <Route
        path='/dashboard'
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path='/create-profile'
        element={
          <PrivateRoute>
            <ProfileForm />
          </PrivateRoute>
        }
      />
      <Route
        path='/edit-profile'
        element={
          <PrivateRoute>
            <ProfileForm />
          </PrivateRoute>
        }
      />
      <Route
        path='/add-experience'
        element={
          <PrivateRoute>
            <AddExperience />
          </PrivateRoute>
        }
      />
      <Route
        path='/add-education'
        element={
          <PrivateRoute>
            <AddEducation />
          </PrivateRoute>
        }
      />
      <Route
        path='/posts'
        element={
          <PrivateRoute>
            <Posts />
          </PrivateRoute>
        }
      />
      <Route
        path='/post/:id'
        element={
          <PrivateRoute>
            <Post />
          </PrivateRoute>
        }
      />
    </Route>
  )
);

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Dispatching loadUser...');
      dispatch(loadUser());
    }

    const handleStorageChange = () => {
      if (!localStorage.getItem('token')) {
        dispatch(logout());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch, user]);

  return (
    <>
      <Alert />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
};

export default App;
