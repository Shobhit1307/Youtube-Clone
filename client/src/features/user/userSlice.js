import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient.js';

export const registerUser = createAsyncThunk('user/register', async (data) => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
});
export const loginUser = createAsyncThunk('user/login', async (data) => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: { userInfo: null },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        localStorage.setItem('token', action.payload.token);
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
