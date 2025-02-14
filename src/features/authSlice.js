import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showAlert } from './alertSlice';
import { clearProfile } from './profileSlice';
import api from '../utils/api';

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.data.id);
      dispatch(clearProfile());
      dispatch(showAlert('Registration successful', 'success'));
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      dispatch(showAlert(errorMessage, 'danger'));
      return rejectWithValue(err.response?.data || errorMessage);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.data.id);
      dispatch(clearProfile());
      dispatch(showAlert('Login successful', 'success'));
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      dispatch(showAlert(errorMessage, 'danger'));
      return rejectWithValue(err.response?.data || errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    delete api.defaults.headers.common['Authorization'];
    dispatch(clearProfile());
    dispatch(showAlert('Logged out successfully', 'success'));
    return null;
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        console.error('No token or userId found in localStorage');
        throw new Error('Token or user ID is missing');
      }

      const { auth } = getState();
      if (auth.user) {
        return auth.user;
      }

      const res = await api.get(`/user/${userId}`);
      return res.data;
    } catch (err) {
      console.error('Error in loadUser:', err.response || err.message);
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
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
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
      .addCase(login.pending, (state) => {
        state.loading = true;
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
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        authSlice.caseReducers.logout(state);
        state.loading = false;
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        console.error('Failed to load user:', action.payload);
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
