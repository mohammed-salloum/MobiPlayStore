// src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================== Initial State ==================
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

      // حالة النجاح
      if (res.data.code === "updateSuccess") {
        return { code: "updateSuccess", user: res.data.user };
      }

      // أي خطأ من السيرفر
      return rejectWithValue({
        code: res.data.code || "updateFailed",
        message: res.data.code || "updateFailed", // الرسالة تظهر بالواجهة فقط
      });
    } catch (err) {
      // network errors أو أي خطأ غير متوقع
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
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
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
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code === "updateSuccess") {
          state.user = action.payload.user;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          state.error = null;
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "updateFailed";

        // إذا انتهت صلاحية التوكن أو لا يوجد توكن
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
