import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { showAlert } from './alertSlice';
import { logout } from './authSlice';

export const getCurrentUserProfile = createAsyncThunk(
  'profile/getCurrentUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return rejectWithValue({
          msg: 'User ID not found in local storage',
          status: 400
        });
      }
      const res = await api.get(`/profile/${userId}`);
      if (!res.data || !res.data.data) {
        return null; // Profile not found is ok as newly created user doesnt have one
      }
      const profile = res.data.data;
      if (profile && profile.skills && Array.isArray(profile.skills)) {
        profile.skills = profile.skills.join(', ');
      }
      return profile;
    } catch (err) {
      console.error('Error in getCurrentUserProfile:', err); // Debug
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
      const res = await api.get('/profiles');
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
  async (username, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.get(`/github/${username}`);
      return res.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || 'No GitHub profile found for this username';
      dispatch(showAlert(errorMessage, 'danger'));
      return rejectWithValue(errorMessage);
    }
  }
);

export const createOrUpdateProfile = createAsyncThunk(
  'profile/createOrUpdateProfile',
  async ({ formData, edit }, { dispatch, rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in local storage');
      }

      const res = edit
        ? await api.put(`/profile/${userId}`, formData)
        : await api.post(`/profile/${userId}`, formData);

      dispatch(
        showAlert(
          edit
            ? 'Profile successfully updated'
            : 'Profile successfully created',
          'success'
        )
      );
      return res.data.data;
    } catch (err) {
      if (err.response?.status === 400) {
        const message = err.response?.data;
        if (typeof message === 'string') {
          dispatch(showAlert(message, 'danger'));
        } else {
          dispatch(
            showAlert('Validation failed. Please check your inputs.', 'danger')
          );
        }
      } else {
        dispatch(showAlert('An error occurred. Please try again.', 'danger'));
      }

      return rejectWithValue({
        msg: err.response?.statusText || err.message,
        status: err.response?.status || 500
      });
    }
  }
);

export const addExperience = createAsyncThunk(
  'profile/addExperience',
  async ({ profileId, formData }, { dispatch, rejectWithValue }) => {
    try {
      console.log('FormData being sent:', formData); // Debugging log
      const res = await api.post(
        `/profile/${profileId}/experience/add`,
        formData
      );
      dispatch(showAlert('Experience added successfully', 'success'));
      return res.data;
    } catch (err) {
      console.error('Error adding experience:', err);
      dispatch(showAlert('Failed to add experience', 'danger'));
      return rejectWithValue(err.response?.data || 'Failed to add experience');
    }
  }
);

export const deleteExperience = createAsyncThunk(
  'profile/deleteExperience',
  async (experienceId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/experience/${experienceId}`);
      dispatch(showAlert('Experience removed successfully', 'success'));
      return experienceId; // Return ID to remove from local state
    } catch (err) {
      console.error('Error deleting experience:', err);
      dispatch(showAlert('Failed to remove experience', 'danger'));
      return rejectWithValue(
        err.response?.data || 'Failed to remove experience'
      );
    }
  }
);

export const addEducation = createAsyncThunk(
  'profile/addEducation',
  async ({ profileId, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post(
        `/profile/${profileId}/education/add`,
        formData
      );
      dispatch(showAlert('Education added successfully', 'success'));
      return res.data;
    } catch (err) {
      console.error('Error adding education:', err);
      dispatch(showAlert('Failed to add education', 'danger'));
      return rejectWithValue(err.response?.data || 'Failed to add education');
    }
  }
);

export const deleteEducation = createAsyncThunk(
  'profile/deleteEducation',
  async (educationId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/education/${educationId}`);
      dispatch(showAlert('Education removed successfully', 'success'));
      return educationId;
    } catch (err) {
      console.error('Error deleting education:', err);
      dispatch(showAlert('Failed to delete education', 'danger'));
      return rejectWithValue(
        err.response?.data || 'Failed to delete education'
      );
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'profile/deleteProfile',
  async (profileId, { dispatch, rejectWithValue }) => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await api.delete(`/profile/${profileId}`);
        dispatch(showAlert('Your profile has been permanently deleted'));
        return null;
      } catch (err) {
        return rejectWithValue({
          msg: err.response.statusText,
          status: err.response.status
        });
      }
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'profile/deleteAccount',
  async (profileId, { dispatch, rejectWithValue }) => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        const userId = localStorage.getItem('userId');
        await api.delete(`/profile/${profileId}`);
        await api.delete(`/user/${userId}`);
        dispatch(logout());
        dispatch(showAlert('Your account has been permanently deleted'));
        return null;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Failed to delete account';
        console.error('Error deleting account:', message);
        return rejectWithValue({
          msg: message,
          status: err.response?.status || 500
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
      // Fulfilled cases
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
      .addCase(createOrUpdateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.experiences.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.educations.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.experiences = state.profile.experiences.filter(
            (exp) => exp.id !== action.payload
          );
        }
        state.loading = false;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.educations = state.profile.educations.filter(
            (edu) => edu.id !== action.payload
          );
        }
        state.loading = false;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.profile = null;
        state.repos = [];
        state.loading = false;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.profile = null;
        state.repos = [];
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      })

      // Rejected cases
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
        state.error = action.payload;
      })
      .addCase(createOrUpdateProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(addExperience.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(addEducation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export const { clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
