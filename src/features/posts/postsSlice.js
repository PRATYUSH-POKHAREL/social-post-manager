import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockSavePost, mockFetchPosts } from './postsAPI';

export const savePostAsync = createAsyncThunk(
  'posts/savePost',
  async (postData) => {
    const response = await mockSavePost(postData);
    return response;
  }
);

export const fetchPostsAsync = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await mockFetchPosts();
    return response;
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  currentPost: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.items.push(action.payload);
    },
    updatePost: (state, action) => {
      const { id, updates } = action.payload;
      const existingPost = state.items.find(post => post.id === id);
      if (existingPost) {
        Object.assign(existingPost, updates);
      }
    },
    deletePost: (state, action) => {
      state.items = state.items.filter(post => post.id !== action.payload);
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(savePostAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(savePostAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.currentPost = null;
      })
      .addCase(savePostAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPostsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPostsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectAllPosts = (state) => state.posts.items;
export const selectPostStatus = (state) => state.posts.status;
export const selectCurrentPost = (state) => state.posts.currentPost;

export const { 
  addPost, 
  updatePost, 
  deletePost, 
  setCurrentPost, 
  clearCurrentPost 
} = postsSlice.actions;

export default postsSlice.reducer;
