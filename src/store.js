import { configureStore } from '@reduxjs/toolkit';
import alertSlice from './features/alertSlice';
import authSlice from './features/authSlice';

const store = configureStore({
  reducer: {
    alert: alertSlice,
    auth: authSlice
  },
  devTools: process.env.NODE_ENV !== 'production' // Enable DevTools only in development mode
});

export default store;
