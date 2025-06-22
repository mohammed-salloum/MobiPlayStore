import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';     // مستورد من ملف إدارة عربة التسوق
import ratingReducer from './ratingSlice'; // مستورد من ملف إدارة التقييمات

export const store = configureStore({
  reducer: {
    cart: cartReducer,     // slice لإدارة حالة العربة
    rating: ratingReducer, // slice لإدارة تقييمات المنتجات
  },
});
