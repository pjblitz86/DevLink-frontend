import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showAlert } from './alertSlice';

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
      localStorage.setItem('userId', res.data.data.id);
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

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const body = JSON.stringify({ email, password });
      const res = await axios.post('/api/login', body, config);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.data.id);
      dispatch(showAlert('Login successful', 'success'));
      return res.data;
    } catch (err) {
      dispatch(showAlert('Login failed', 'danger'));
      return rejectWithValue(err.response?.data || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('token');
  api.defaults.headers.common['x-auth-token'] = '';
  return null;
});

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Loading user...');
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        throw new Error('Token or user ID is missing');
      }
      api.defaults.headers.common['x-auth-token'] = token;
      const res = await api.get(`/user/${userId}`);
      console.log('User loaded:', res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to load user');
    }
  }
);

const handleAuthSuccess = (state, action) => {
  state.isAuthenticated = true;
  state.loading = false;
  state.token = action.payload.token;
  state.user = action.payload.user;
};

const handleAuthFailure = (state) => {
  state.isAuthenticated = false;
  state.loading = false;
  state.token = null;
  state.user = null;
  localStorage.removeItem('token');
};

const handleUserLoadSuccess = (state, action) => {
  state.isAuthenticated = true;
  state.loading = false;
  state.user = action.payload;
};

const handleUserLoadFailure = (state) => {
  state.isAuthenticated = false;
  state.loading = false;
};

const handleLogout = (state) => {
  state.isAuthenticated = false;
  state.loading = false;
  state.token = null;
  state.user = null;
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null
  },
  reducers: {
    logout: handleLogout
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, handleAuthSuccess)
      .addCase(register.rejected, handleAuthFailure)
      .addCase(login.fulfilled, handleAuthSuccess)
      .addCase(login.rejected, handleAuthFailure)
      .addCase(loadUser.fulfilled, handleUserLoadSuccess)
      .addCase(loadUser.rejected, handleUserLoadFailure)
      .addCase(logoutUser.fulfilled, handleLogout);
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
