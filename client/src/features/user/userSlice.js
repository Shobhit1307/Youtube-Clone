import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import apiClient from '../../api/apiClient.js';
import { toast } from 'react-toastify';

// Register user thunk
export const registerUser = createAsyncThunk('user/register', async (data, { rejectWithValue }) => {
  try {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Login user thunk
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
    logout: state => {
      state.userInfo = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        toast.success('Registered successfully!');
      })
      .addCase(registerUser.rejected, (_, action) => {
        toast.error(action.payload || 'Registration failed');
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        toast.success('Logged in successfully!');
      })
      .addCase(loginUser.rejected, (_, action) => {
        toast.error(action.payload || 'Login failed');
      })
      .addCase(PURGE, state => {
        state.userInfo = null;
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
