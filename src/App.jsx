import React from 'react';
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
import Alert from './layouts/Alert';
import { Provider } from 'react-redux';
import store from './store';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<LandingPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/create-profile' element={<ProfileForm />} />
      <Route path='/edit-profile' element={<ProfileForm />} />
      <Route path='/add-experience' element={<AddExperience />} />
      <Route path='/add-education' element={<AddEducation />} />
    </Route>
  )
);

const App = () => {
  // useEffect(() => {
  //   if (localStorage.token) {
  //     setAuthToken(localStorage.token);
  //   }
  //   store.dispatch(loadUser());

  //   window.addEventListener('storage', () => {
  //     if (!localStorage.token) store.dispatch({ type: LOGOUT });
  //   });
  // }, []);

  return (
    <Provider store={store}>
      <Alert />
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
};

export default App;
