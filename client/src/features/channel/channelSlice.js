// src/features/channel/channelSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient.js';

export const fetchMyChannel = createAsyncThunk(
  'channel/fetchMyChannel',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/channels/my');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'No channel found');
    }
  }
);

const channelSlice = createSlice({
  name: 'channel',
  initialState: { myChannel: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMyChannel.fulfilled, (state, action) => {
        state.myChannel = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchMyChannel.rejected, (state, action) => {
        state.myChannel = null;
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMyChannel.pending, state => {
        state.status = 'loading';
      });
  }
});

export default channelSlice.reducer;
