import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import apiClient from '../../api/apiClient.js';
import { toast } from 'react-toastify';
import jwtDecode from '../../utils/jwtDecode.js';

let logoutTimer;

export const registerUser = createAsyncThunk('user/register', async (data, { rejectWithValue }) => {
  try {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const loginUser = createAsyncThunk('user/login', async (data, { rejectWithValue }) => {
  try {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: { userInfo: null },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      if (logoutTimer) clearTimeout(logoutTimer);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        const payload = action.payload;
        payload._id = payload._id || payload.id || payload._id;
        state.userInfo = payload;
        toast.success('Registered successfully!');
      })
      .addCase(registerUser.rejected, (_, action) => {
        toast.error(action.payload || 'Registration failed');
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const payload = action.payload;
        payload._id = payload._id || payload.id || payload._id;
        state.userInfo = payload;
        toast.success('Logged in successfully!');

        // Setup auto logout timer based on token expiry
        if (payload.token) {
          const decoded = jwtDecode(payload.token);
          if (decoded?.exp) {
            const expiresInMs = decoded.exp * 1000 - Date.now();
            if (logoutTimer) clearTimeout(logoutTimer);
            logoutTimer = setTimeout(() => {
              toast.info('Session expired. Logging out...');
              window.store.dispatch(userSlice.actions.logout());
            }, expiresInMs);
          }
        }
      })
      .addCase(loginUser.rejected, (_, action) => {
        toast.error(action.payload || 'Login failed');
      })
      .addCase(PURGE, (state) => {
        state.userInfo = null;
        if (logoutTimer) clearTimeout(logoutTimer);
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
