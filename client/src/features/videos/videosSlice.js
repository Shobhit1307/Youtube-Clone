import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient.js';

export const getVideos = createAsyncThunk('videos/getVideos', async ({ search = '', category = '' }) => {
  const response = await apiClient.get(`/videos?search=${search}&category=${category}`);
  return response.data;
});
export const likeVideo = createAsyncThunk('videos/likeVideo', async (id) => {
  const response = await apiClient.post(`/videos/${id}/like`);
  return { id, data: response.data };
});

const videosSlice = createSlice({
  name: 'videos',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getVideos.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(likeVideo.fulfilled, (state, action) => {
        const video = state.list.find(v => v._id === action.payload.id);
        if (video) {
          video.likes = action.payload.data.likes;
          video.dislikes = action.payload.data.dislikes;
        }
      });
  },
});

export default videosSlice.reducer;
