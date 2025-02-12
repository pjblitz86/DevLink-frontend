import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { showAlert } from './alertSlice';

export const getPosts = createAsyncThunk(
  'post/getPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/posts');
      return res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
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
      const res = await api.get(`/posts/${postId}`);
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
      const res = await api.post(`/posts/user/${userId}`, formData);
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
      const res = await api.put(`/posts/${postId}`, formData);
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
  async ({ postId, userId }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/posts/${postId}?userId=${userId}`);
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
      const res = await api.post(`/posts/${postId}/like/${userId}`);
      dispatch(showAlert('Post liked!', 'success'));
      return { postId, likes: res.data.likes || [] };
    } catch (err) {
      if (err.response?.status === 409) {
        dispatch(showAlert('You have already liked this post!', 'danger'));
      } else {
        dispatch(showAlert('Failed to like post!', 'danger'));
      }
      return rejectWithValue(err.response?.data || 'Failed to like post');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'post/unlikePost',
  async ({ userId, postId }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.delete(`/posts/${postId}/unlike/${userId}`);
      dispatch(showAlert('Post unliked!', 'success'));
      return { postId, likes: res.data.likes || [] };
    } catch (err) {
      if (err.response?.status === 409) {
        dispatch(showAlert('You have not liked this post!', 'danger'));
      } else {
        dispatch(showAlert('Failed to unlike post', 'danger'));
      }

      return rejectWithValue(err.response?.data || 'Failed to unlike post');
    }
  }
);

export const addComment = createAsyncThunk(
  'post/addComment',
  async ({ postId, text, name, avatar }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post(`/posts/${postId}/comment`, {
        text,
        name,
        avatar
      });
      dispatch(showAlert('Comment added successfully', 'success'));
      return { postId, comment: res.data };
    } catch (err) {
      dispatch(showAlert('Failed to add comment', 'danger'));
      return rejectWithValue(err.response?.data || 'Failed to add comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'post/deleteComment',
  async (commentId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/posts/comment/${commentId}`);
      dispatch(showAlert('Comment deleted successfully', 'success'));
      return commentId;
    } catch (err) {
      dispatch(showAlert('Failed to delete comment', 'danger'));
      return rejectWithValue(err.response?.data || 'Failed to delete comment');
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
        const newPost = {
          ...action.payload,
          user: {
            id: action.meta.arg.userId
          }
        };
        state.posts.unshift(newPost);
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
          state.posts[index] = action.payload;
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
        console.error('Failed to delete post:', action.payload);
        state.error = action.payload;
        state.loading = false;
      })
      // likes
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        const postIndex = state.posts.findIndex((p) => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex] = {
            ...state.posts[postIndex],
            likes: Array.isArray(likes) ? [...likes] : []
          };
          state.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        state.loading = false;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        const postIndex = state.posts.findIndex((p) => p.id === postId);

        if (postIndex !== -1) {
          state.posts[postIndex] = {
            ...state.posts[postIndex],
            likes: Array.isArray(likes) ? [...likes] : []
          };
        }
        state.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        state.loading = false;
      })
      // comments
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (state.post && state.post.id === postId) {
          state.post.comments = [...(state.post.comments || []), comment];
        }

        state.loading = false;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;

        if (state.post && state.post.id === postId) {
          state.post = {
            ...state.post,
            comments: state.post.comments.filter(
              (comment) => comment.id !== commentId
            )
          };
        }

        state.posts = state.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId
                )
              }
            : post
        );

        state.loading = false;
      });
  }
});

export const { clearPost } = postSlice.actions;

export default postSlice.reducer;
