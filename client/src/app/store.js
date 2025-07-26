import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice.js';
import videosReducer from '../features/videos/videosSlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer,
    videos: videosReducer,
  },
});
