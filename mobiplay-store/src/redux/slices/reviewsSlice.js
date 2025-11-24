import { createSlice } from "@reduxjs/toolkit";

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.id : "guest";
};

const savedReviews = (() => {
  try {
    return JSON.parse(localStorage.getItem(`reviews_${getUserId()}`) || "{}");
  } catch {
    return {};
  }
})();

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: savedReviews,
  reducers: {
    setRating: (state, action) => {
      const { productId, rating, productRating = 0, productRatingCount = 0 } = action.payload;
      if (!productId || rating < 1 || rating > 5) return;

      const prev = state[productId] || { userRating: 0, avgRating: productRating, ratingCount: productRatingCount };
      if (prev.userRating > 0) return;

      const newCount = prev.ratingCount + 1;
      const newAvg = (prev.avgRating * prev.ratingCount + rating) / newCount;

      state[productId] = {
        userRating: rating,
        avgRating: newAvg,
        ratingCount: newCount,
      };

      localStorage.setItem(`reviews_${getUserId()}`, JSON.stringify(state));
    },

    removeRating: (state, action) => {
      const productId = action.payload;
      delete state[productId];
      localStorage.setItem(`reviews_${getUserId()}`, JSON.stringify(state));
    },

    mergeGuestReviews: (state, action) => {
      const userId = action.payload;
      const guestReviews = JSON.parse(localStorage.getItem("reviews_guest") || "{}");

      const merged = { ...state };
      Object.keys(guestReviews).forEach(productId => {
        if (!merged[productId] || merged[productId].userRating === 0) {
          merged[productId] = guestReviews[productId];
        }
      });

      Object.keys(merged).forEach(key => state[key] = merged[key]);

      localStorage.setItem(`reviews_${userId}`, JSON.stringify(merged));
      localStorage.removeItem("reviews_guest");
    },

    setReviewsDirect: (state, action) => {
      const data = action.payload || {};
      Object.keys(state).forEach(key => delete state[key]);
      Object.keys(data).forEach(key => state[key] = data[key]);
    },
  },
});

export const { setRating, removeRating, mergeGuestReviews, setReviewsDirect } = reviewsSlice.actions;
export const selectReviews = (state) => state.reviews;

export default reviewsSlice.reducer;
