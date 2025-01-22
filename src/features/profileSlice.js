import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { showAlert } from './alertSlice';

export const getCurrentUserProfile = createAsyncThunk(
  'profile/getCurrentUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId) {
        throw new Error('User ID not found in local storage');
      }
      const res = await api.get(`/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue({
        msg: err.response?.statusText || err.message,
        status: err.response?.status || 500
      });
    }
  }
);

export const getProfiles = createAsyncThunk(
  'profile/getProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/profile');
      return res.data;
    } catch (err) {
      return rejectWithValue({
        msg: err.response.statusText,
        status: err.response.status
      });
    }
  }
);

export const getProfileById = createAsyncThunk(
  'profile/getProfileById',
  async (profileId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/profile/${profileId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue({
        msg: err.response.statusText,
        status: err.response.status
      });
    }
  }
);

export const getGithubRepos = createAsyncThunk(
  'profile/getGithubRepos',
  async (username, { rejectWithValue }) => {
    try {
      const res = await api.get(`/profile/github/${username}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(null); // No repos available
    }
  }
);

export const createProfile = createAsyncThunk(
  'profile/createProfile',
  async ({ formData, edit }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/profile', formData);
      dispatch(
        showAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')
      );
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(showAlert(error.msg, 'danger')));
      }
      return rejectWithValue({
        msg: err.response.statusText,
        status: err.response.status
      });
    }
  }
);

export const addExperience = createAsyncThunk(
  'profile/addExperience',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put('/profile/experience', formData);
      dispatch(showAlert('Experience Added', 'success'));
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(showAlert(error.msg, 'danger')));
      }
      return rejectWithValue({
        msg: err.response.statusText,
        status: err.response.status
      });
    }
  }
);

export const addEducation = createAsyncThunk(
  'profile/addEducation',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put('/profile/education', formData);
      dispatch(showAlert('Education Added', 'success'));
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(showAlert(error.msg, 'danger')));
      }
      return rejectWithValue({
        msg: err.response.statusText,
        status: err.response.status
      });
    }
  }
);

export const deleteExperience = createAsyncThunk(
  'profile/deleteExperience',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.delete(`/profile/experience/${id}`);
      dispatch(showAlert('Experience Removed', 'success'));
      return res.data;
    } catch (err) {
      return rejectWithValue({
        msg: err.response.statusText,
        status: err.response.status
      });
    }
  }
);

export const deleteEducation = createAsyncThunk(
  'profile/deleteEducation',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.delete(`/profile/education/${id}`);
      dispatch(showAlert('Education Removed', 'success'));
      return res.data;
    } catch (err) {
      return rejectWithValue({
        msg: err.response.statusText,
        status: err.response.status
      });
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'profile/deleteAccount',
  async (_, { dispatch, rejectWithValue }) => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await api.delete('/profile');
        dispatch(showAlert('Your account has been permanently deleted'));
        return null; // Return null to clear profile
      } catch (err) {
        return rejectWithValue({
          msg: err.response.statusText,
          status: err.response.status
        });
      }
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
  },
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.repos = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(getProfiles.fulfilled, (state, action) => {
        state.profiles = action.payload;
        state.loading = false;
      })
      .addCase(getProfileById.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(getGithubRepos.fulfilled, (state, action) => {
        state.repos = action.payload;
        state.loading = false;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.profile = null;
        state.repos = [];
        state.loading = false;
      })
      .addCase(getCurrentUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.profile = null;
        state.loading = false;
      })
      .addCase(getProfiles.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getProfileById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getGithubRepos.rejected, (state) => {
        state.repos = [];
        state.loading = false;
      });
  }
});

export const { clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
