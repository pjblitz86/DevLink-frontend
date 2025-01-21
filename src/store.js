import { configureStore } from '@reduxjs/toolkit';
import alertSlice from './features/alertSlice';

const store = configureStore({
  reducer: {
    alert: alertSlice
  },
  devTools: process.env.NODE_ENV !== 'production' // Enable DevTools only in development mode
});

export default store;
