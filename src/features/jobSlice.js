import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { showAlert } from './alertSlice';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (limit, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/jobs${limit ? `?limit=${limit}` : ''}`
      );
      console.log('Fetched jobs:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Fetch Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to fetch jobs');
    }
  }
);

export const addJob = createAsyncThunk(
  'jobs/addJob',
  async (jobData, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.post('/api/jobs', jobData);
      dispatch(showAlert('Job created successfully', 'success'));
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add job'
      );
    }
  }
);

export const editJob = createAsyncThunk(
  'jobs/editJob',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue('Unauthorized: No Token Found');

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const res = await api.put(`/api/jobs/${jobId}`, jobData, config);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to edit job'
      );
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue('Unauthorized: No Token Found');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await api.delete(`/api/jobs/${jobId}`, config);
      return jobId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete job'
      );
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    job: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(addJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(editJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.map((job) =>
          job._id === action.payload.id ? action.payload : job
        );
      })
      .addCase(editJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default jobSlice.reducer;
