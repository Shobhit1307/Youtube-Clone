// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient.js";
import { toast } from 'react-toastify';

// Register thunk with rejectWithValue for proper error propagation
export const registerUser = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue(message);
    }
  }
);

// Login thunk
export const loginUser = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  userInfo: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        localStorage.setItem("token", action.payload.token);
        toast.success("Registered successfully!", { toastId: "register-success" });
      })
      .addCase(registerUser.rejected, (_state, action) => {
        toast.error(action.payload || action.error.message || "Registration failed", { toastId: "register-error" });
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        localStorage.setItem("token", action.payload.token);
        toast.success("Logged in successfully!", { toastId: "login-success" });
      })
      .addCase(loginUser.rejected, (_state, action) => {
        toast.error(action.payload || action.error.message || "Invalid credentials", { toastId: "login-error" });
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
