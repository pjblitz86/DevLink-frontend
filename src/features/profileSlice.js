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
      const res = await api.get(`/profiles/user/${userId}`);
      if (!res.data || !res.data.data) {
        return null; // Profile not found is ok as newly created user doesnt have one
      }
      const profile = res.data.data;
      if (profile && profile.skills && Array.isArray(profile.skills)) {
        profile.skills = profile.skills.join(', ');
      }
      return profile;
    } catch (err) {
      if (err.response?.status === 404) {
        return null;
      }

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
      const res = await api.get(`/profiles/${profileId}`);
      const profile = res.data.data;
      return profile;
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
  async (username, { getState, rejectWithValue }) => {
    try {
      const res = await api.get(`/github/${username}`);
      return res.data || [];
    } catch (err) {
      if (err.response?.status === 401) {
        console.error('GitHub API: Unauthorized request');
        return rejectWithValue(
          'Unauthorized. Please check your token or credentials.'
        );
      }
      return rejectWithValue('Failed to fetch GitHub repositories.');
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
        ? await api.put(`/profiles/user/${userId}`, formData)
        : await api.post(`/profiles/user/${userId}`, formData);

      dispatch(
        showAlert(
          edit
            ? 'Profile updated successfully'
            : 'Profile created successfully',
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
        `/profiles/${profileId}/experience/add`,
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
      return experienceId;
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
        `/profiles/${profileId}/education/add`,
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
        await api.delete(`/profiles/${profileId}`);
        dispatch(clearProfile());
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
  async (userId, { dispatch, getState, rejectWithValue }) => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        const { profile } = getState().profile;
        const profileId = profile?.id;
        if (profileId) {
          await api.delete(`/profiles/${profileId}`);
        } else {
          console.warn('No profile found, skipping profile deletion.');
        }
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
    // getCurrentUserProfile
    builder
      .addCase(getCurrentUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(getCurrentUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.profile = null;
        state.loading = false;
      });

    // getProfiles
    builder
      .addCase(getProfiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfiles.fulfilled, (state, action) => {
        state.profiles = action.payload;
        state.loading = false;
      })
      .addCase(getProfiles.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    // getProfileById
    builder
      .addCase(getProfileById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfileById.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(getProfileById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    // getGithubRepos
    builder
      // .addCase(getGithubRepos.pending, (state) => {
      //   state.loading = true;
      // }) TODO
      .addCase(getGithubRepos.fulfilled, (state, action) => {
        state.repos = action.payload;
        state.loading = false;
      })
      .addCase(getGithubRepos.rejected, (state, action) => {
        state.repos = [];
        state.error = action.payload || 'Failed to fetch GitHub repos';
        state.loading = false;
      });

    // createOrUpdateProfile
    builder
      .addCase(createOrUpdateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrUpdateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(createOrUpdateProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    // addExperience
    builder
      .addCase(addExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        if (!state.profile) {
          state.profile = {};
        }
        if (!state.profile.experiences) {
          state.profile.experiences = [];
        }
        state.profile.experiences.push(action.payload);
        state.loading = false;
      })
      .addCase(addExperience.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    // addEducation
    builder
      .addCase(addEducation.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.educations.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(addEducation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    // deleteExperience
    builder
      .addCase(deleteExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.experiences = state.profile.experiences.filter(
            (exp) => exp.id !== action.payload
          );
        }
        state.loading = false;
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    // deleteEducation
    builder
      .addCase(deleteEducation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.educations = state.profile.educations.filter(
            (edu) => edu.id !== action.payload
          );
        }
        state.loading = false;
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    // deleteProfile
    builder
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.profile = null;
        state.repos = [];
        state.loading = false;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    // deleteAccount
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.profile = null;
        state.repos = [];
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
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
