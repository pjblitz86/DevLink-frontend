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

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post('/login', { email, password });
      // Set token in localStorage and axios headers
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['x-auth-token'] = res.data.token;
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
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
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        throw new Error('Token or user ID is missing');
      }
      api.defaults.headers.common['x-auth-token'] = token;
      const res = await api.get(`/user/${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to load user');
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
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(loadUser.rejected, (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    });
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.token = null;
        state.user = null;
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
