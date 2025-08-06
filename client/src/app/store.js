import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice.js';
import videosReducer from '../features/videos/videosSlice.js';
import channelReducer from '../features/channel/channelSlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer,
    videos: videosReducer,
    channel: channelReducer,
  },
});
