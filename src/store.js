import { configureStore } from '@reduxjs/toolkit';
import alertSlice from './features/alertSlice';
import authSlice from './features/authSlice';
import profileSlice from './features/profileSlice';

const store = configureStore({
  reducer: {
    alert: alertSlice,
    auth: authSlice,
    profile: profileSlice
  },
  devTools: process.env.NODE_ENV !== 'production' // Enable DevTools only in development mode
});

export default store;
