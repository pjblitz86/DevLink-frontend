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
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      console.log('Loading user with token:', token, 'and userId:', userId);

      if (!token || !userId) {
        throw new Error('Token or user ID is missing');
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await api.get(`/user/${userId}`);
      console.log('User loaded:', res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to load user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: true,
    user: null
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.data;
      })
      .addCase(register.rejected, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.data;
      })
      .addCase(login.rejected, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
      })
      .addCase(loadUser.pending, (state) => {
        console.log('loadUser pending');
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        console.log('User loaded in authSlice:', action.payload.data);
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
