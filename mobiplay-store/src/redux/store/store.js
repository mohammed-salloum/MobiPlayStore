// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import cartReducer from "../slices/cartSlice";
import reviewsReducer from "../slices/reviewsSlice";

// Configure Redux store
export const store = configureStore({
  reducer: {
    user: userReducer,      // Handles user state (login, logout, profile)
    cart: cartReducer,      // Handles cart state (guest/user cart, add/remove items)
    reviews: reviewsReducer // Handles reviews/ratings for products
  },
});

export default store;
