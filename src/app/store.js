import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import draftsReducer from '../features/drafts/draftsSlice';
import platformsReducer from '../features/platforms/platformsSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    drafts: draftsReducer,
    platforms: platformsReducer,
  },
});