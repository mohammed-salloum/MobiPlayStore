import { setUser, setCartItemsDirect } from "../redux/slices/cartSlice";
import { logout as logoutAction } from "../redux/slices/userSlice";

// Helper function to safely parse JSON from localStorage
const safeParse = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.warn(`Failed to parse localStorage key "${key}"`, err);
    return defaultValue;
  }
};

/**
 * Load user data on automatic login
 */
export const loadUserData = (user, dispatch) => {
  if (!user) return;

  // Merge guest cart with user cart
  const guestCart = safeParse("cart_guest", []);
  const userCartKey = `cart_${user.id}`;
  const userCart = safeParse(userCartKey, []);
  const mergedCart = [...userCart];

  guestCart.forEach(item => {
    const existing = mergedCart.find(i => i.id === item.id);
    if (existing) existing.quantity += item.quantity;
    else mergedCart.push(item);
  });

  // Save the merged cart for the user and remove guest cart
  localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
  localStorage.removeItem("cart_guest");

  // Update Redux
  dispatch(setUser(user.id));
  dispatch(setCartItemsDirect(mergedCart));

  // Merge guest reviews with user reviews
  const guestReviews = safeParse("reviews_guest", {});
  const userReviewsKey = `reviews_${user.id}`;
  const userReviews = safeParse(userReviewsKey, {});
  const mergedReviews = { ...userReviews, ...guestReviews };
  localStorage.setItem(userReviewsKey, JSON.stringify(mergedReviews));
  localStorage.removeItem("reviews_guest");

  // Directly update Redux for reviews
  dispatch({ type: "reviews/setReviewsDirect", payload: mergedReviews });
};

/**
 * Logout the user
 */
export const handleLogout = (cartItems, dispatch, navigate, lang) => {
  // Save current cart as guest cart
  const currentCart = cartItems || [];
  localStorage.setItem("cart_guest", JSON.stringify(currentCart));

  // Perform logout
  dispatch(logoutAction());

  // Reset guest user and cart in Redux
  dispatch(setUser(null));
  dispatch(setCartItemsDirect([]));

  // Reset guest reviews in Redux
  dispatch({ type: "reviews/setReviewsDirect", payload: {} });

  // Redirect to login page
  navigate(`/${lang}/login`, { replace: true });
};
