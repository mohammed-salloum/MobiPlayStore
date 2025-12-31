// src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================== Initial State ==================
// Load saved user and token from localStorage
const savedUser = JSON.parse(localStorage.getItem("user")) || null;
const savedToken = localStorage.getItem("token") || null;

const initialState = {
  user: savedUser,
  token: savedToken,
  loading: false,
  error: null,
};

// ================== Update User Async Thunk ==================
export const updateUserAsync = createAsyncThunk(
  "user/updateUserAsync",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({
          code: "noToken",
          message: "No token found. Please login again.",
        });
      }

      const res = await axios.put(
        `http://localhost:5000/api/auth/update/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Success case
      if (res.data.code === "updateSuccess") {
        return { code: "updateSuccess", user: res.data.user };
      }

      // Any server error
      return rejectWithValue({
        code: res.data.code || "updateFailed",
        message: res.data.code || "updateFailed", // UI message
      });
    } catch (err) {
      // Network errors or unexpected errors
      const errorData = err.response?.data;
      return rejectWithValue({
        code: errorData?.code || "updateFailed",
        message: errorData?.code || "updateFailed",
      });
    }
  }
);

// ================== Slice ==================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Login action
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending state when updating user
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fulfilled state when update succeeds
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code === "updateSuccess") {
          state.user = action.payload.user;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          state.error = null;
        }
      })
      // Rejected state when update fails
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "updateFailed";

        // If token expired or missing
        if (action.payload?.code === "tokenExpired" || action.payload?.code === "noToken") {
          state.user = null;
          state.token = null;
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      });
  },
});

// ================== Selectors ==================
export const { login, logout } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
