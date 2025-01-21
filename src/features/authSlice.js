import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showAlert } from './alertSlice';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { dispatch, rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const body = JSON.stringify({ name, email, password });
      const res = await axios.post('/api/register', body, config);
      localStorage.setItem('token', res.data.token);
      dispatch(showAlert('Registration successful', 'success'));
      return res.data;
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data) {
        const errors = err.response.data;
        Object.values(errors).forEach((msg) =>
          dispatch(showAlert(msg, 'danger'))
        );
        return rejectWithValue(errors);
      }
      dispatch(showAlert('Registration failed', 'danger'));
      return rejectWithValue('Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(register.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(register.rejected, (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
