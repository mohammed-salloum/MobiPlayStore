import { createSlice } from "@reduxjs/toolkit";

// Get current user ID, or "guest" if no user
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.id : "guest";
};

// Load saved reviews from localStorage
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
    // Add a new rating for a product
    setRating: (state, action) => {
      const { productId, rating, productRating = 0, productRatingCount = 0 } = action.payload;
      if (!productId || rating < 1 || rating > 5) return;

      const prev = state[productId] || { userRating: 0, avgRating: productRating, ratingCount: productRatingCount };
      if (prev.userRating > 0) return; // prevent overwriting existing user rating

      const newCount = prev.ratingCount + 1;
      const newAvg = (prev.avgRating * prev.ratingCount + rating) / newCount;

      state[productId] = {
        userRating: rating,
        avgRating: newAvg,
        ratingCount: newCount,
      };

      // Save updated reviews to localStorage
      localStorage.setItem(`reviews_${getUserId()}`, JSON.stringify(state));
    },

    // Remove rating for a product
    removeRating: (state, action) => {
      const productId = action.payload;
      delete state[productId];
      localStorage.setItem(`reviews_${getUserId()}`, JSON.stringify(state));
    },

    // Merge guest reviews into user reviews upon login
    mergeGuestReviews: (state, action) => {
      const userId = action.payload;
      const guestReviews = JSON.parse(localStorage.getItem("reviews_guest") || "{}");

      const merged = { ...state };
      Object.keys(guestReviews).forEach(productId => {
        if (!merged[productId] || merged[productId].userRating === 0) {
          merged[productId] = guestReviews[productId];
        }
      });

      // Update state with merged reviews
      Object.keys(merged).forEach(key => state[key] = merged[key]);

      // Save merged reviews to user-specific localStorage and remove guest reviews
      localStorage.setItem(`reviews_${userId}`, JSON.stringify(merged));
      localStorage.removeItem("reviews_guest");
    },

    // Directly set reviews (overwrite current state)
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
