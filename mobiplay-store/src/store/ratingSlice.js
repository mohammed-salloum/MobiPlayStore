import { createSlice } from "@reduxjs/toolkit";

// الحالة الابتدائية تحتوي على:
// - ratingsData: تخزن معلومات التقييم لكل منتج (مجموع التقييمات وعددها)
// - userRatings: تخزن تقييمات كل مستخدم لكل منتج (تقييم المستخدم الفردي)
const initialState = {
  ratingsData: {},  // مثال: { productId: { totalRating: 15, count: 3 } }
  userRatings: {},  // مثال: { productId: 5 }
};

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    rateProduct(state, action) {
      const { productId, rating } = action.payload;
      const prevRating = state.userRatings[productId];

      // لو ما فيه بيانات تقييمات للمنتج، نهيئها
      if (!state.ratingsData[productId]) {
        state.ratingsData[productId] = { totalRating: 0, count: 0 };
      }

      if (prevRating !== undefined) {
        // تعديل تقييم سابق: نطرح التقييم القديم من المجموع ونضيف الجديد
        state.ratingsData[productId].totalRating -= prevRating;
        state.ratingsData[productId].totalRating += rating;
        // عدد التقييمات لا يتغير لأن المستخدم عدل تقييمه فقط
      } else {
        // تقييم جديد: نضيف التقييم للمجموع ونزيد عدد التقييمات
        state.ratingsData[productId].totalRating += rating;
        state.ratingsData[productId].count += 1;
      }

      // تحديث تقييم المستخدم في userRatings
      state.userRatings[productId] = rating;
    },
  },
});

export const { rateProduct } = ratingSlice.actions;
export default ratingSlice.reducer;
