import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { showAlert } from './alertSlice';

export const getPosts = createAsyncThunk(
  'post/getPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/posts');
      return res.data;
    } catch (err) {
      return rejectWithValue({
        msg: err.response?.statusText || 'Failed to fetch posts',
        status: err.response?.status || 500
      });
    }
  }
);

export const getPostById = createAsyncThunk(
  'post/getPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/post/${postId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue({
        msg: err.response?.statusText || 'Failed to fetch post',
        status: err.response?.status || 500
      });
    }
  }
);

export const createPost = createAsyncThunk(
  'post/createPost',
  async ({ userId, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post(`/post/user/${userId}`, formData);
      dispatch(showAlert('Post created successfully', 'success'));
      return res.data;
    } catch (err) {
      dispatch(
        showAlert(
          err.response?.data?.message || 'Failed to create post',
          'danger'
        )
      );
      return rejectWithValue({
        msg: err.response?.statusText || 'Failed to create post',
        status: err.response?.status || 500
      });
    }
  }
);

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async ({ postId, formData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/post/${postId}`, formData);
      dispatch(showAlert('Post updated successfully', 'success'));
      return res.data;
    } catch (err) {
      dispatch(
        showAlert(
          err.response?.data?.message || 'Failed to update post',
          'danger'
        )
      );
      return rejectWithValue({
        msg: err.response?.statusText || 'Failed to update post',
        status: err.response?.status || 500
      });
    }
  }
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (postId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/post/${postId}`);
      dispatch(showAlert('Post deleted successfully', 'success'));
      return postId;
    } catch (err) {
      dispatch(
        showAlert(
          err.response?.data?.message || 'Failed to delete post',
          'danger'
        )
      );
      return rejectWithValue({
        msg: err.response?.statusText || 'Failed to delete post',
        status: err.response?.status || 500
      });
    }
  }
);

export const likePost = createAsyncThunk(
  'post/likePost',
  async ({ userId, postId }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post(`/post/${postId}/like/${userId}`);
      return { postId, likes: res.data.likes }; // Update only the likes array
    } catch (err) {
      dispatch(showAlert('Failed to like post', 'danger'));
      return rejectWithValue(err.response?.data || 'Failed to like post');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'post/unlikePost',
  async ({ userId, postId }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.delete(`/post/${postId}/unlike/${userId}`);
      return { postId, likes: res.data.likes }; // Update only the likes array
    } catch (err) {
      dispatch(showAlert('Failed to unlike post', 'danger'));
      return rejectWithValue(err.response?.data || 'Failed to unlike post');
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    post: null,
    loading: true,
    error: {}
  },
  reducers: {
    clearPost: (state) => {
      state.post = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all posts
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = Array.isArray(action.payload)
          ? action.payload.sort((a, b) => new Date(b.date) - new Date(a.date))
          : [];
        state.loading = false;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Fetch a single post
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.post = action.payload;
        state.loading = false;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Create a post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Update a post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload; // Update the post in the array
        }
        state.loading = false;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Delete a post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        state.loading = false;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // likes
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) post.likes = likes;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) post.likes = likes;
      });
  }
});

export const { clearPost } = postSlice.actions;

export default postSlice.reducer;
