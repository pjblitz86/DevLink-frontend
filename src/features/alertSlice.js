import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = [];

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.push(action.payload);
    },
    removeAlert: (state, action) => {
      return state.filter((alert) => alert.id !== action.payload);
    }
  }
});

export const { setAlert, removeAlert } = alertSlice.actions;

export const showAlert =
  (msg, alertType, timeout = 3000) =>
  (dispatch) => {
    const id = uuidv4();
    dispatch(setAlert({ msg, alertType, id, timeout }));

    setTimeout(() => {
      dispatch(removeAlert(id));
    }, timeout);
  };

export default alertSlice.reducer;
