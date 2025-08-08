import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '../features/user/userSlice.js';
import channelReducer from '../features/channel/channelSlice.js';
import videosReducer from '../features/videos/videosSlice.js';

const persistConfig = {
  key: 'user',
  storage,
  whitelist: ['userInfo']
};

const persistedUser = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUser,
    channel: channelReducer,
    videos: videosReducer
  },
  middleware: getDefault => getDefault({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});

// expose store to window for logout timer dispatch
if (typeof window !== 'undefined') {
  window.store = store;
}

export const persistor = persistStore(store);
