import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { showAlert } from './alertSlice';

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

export const updateExperience = createAsyncThunk(
  'profile/updateExperience',
  async ({ experienceId, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/experience/${experienceId}`, formData);
      dispatch(showAlert('Experience updated successfully', 'success'));
      return res.data;
    } catch (err) {
      console.error('Error updating experience:', err);
      dispatch(showAlert('Failed to update experience', 'danger'));
      return rejectWithValue(
        err.response?.data || 'Failed to update experience'
      );
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

export const updateEducation = createAsyncThunk(
  'profile/updateEducation',
  async ({ educationId, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/education/${educationId}`, formData);
      dispatch(showAlert('Education updated successfully', 'success'));
      return res.data;
    } catch (err) {
      console.error('Error updating education:', err);
      dispatch(showAlert('Failed to update education', 'danger'));
      return rejectWithValue(
        err.response?.data || 'Failed to update education'
      );
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
        console.log('Profile Data Fulfilled:', action.payload); // Debug
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
        state.profile.experiences.push(action.payload);
        state.loading = false;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        const index = state.profile.experiences.findIndex(
          (exp) => exp.id === action.payload.id
        );
        if (index !== -1) {
          state.profile.experiences[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.profile.educations.push(action.payload);
        state.loading = false;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        const index = state.profile.educations.findIndex(
          (edu) => edu.id === action.payload.id
        );
        if (index !== -1) {
          state.profile.educations[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.profile.experiences = state.profile.experiences.filter(
          (exp) => exp.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.profile.educations = state.profile.educations.filter(
          (edu) => edu.id !== action.payload
        );
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
      .addCase(createOrUpdateProfile.rejected, (state, action) => {
        state.error = action.payload;
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
      .addCase(addEducation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateEducation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteEducation.rejected, (state, action) => {
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
