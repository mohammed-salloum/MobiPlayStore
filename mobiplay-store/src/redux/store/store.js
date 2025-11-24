// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import cartReducer from "../slices/cartSlice";
import reviewsReducer from "../slices/reviewsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    reviews: reviewsReducer,
  },
});

export default store;
