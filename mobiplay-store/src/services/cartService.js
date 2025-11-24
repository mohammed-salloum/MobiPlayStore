import { setUser, setCartItemsDirect } from "../redux/slices/cartSlice";
import { logout as logoutAction } from "../redux/slices/userSlice";

// دالة مساعدة لقراءة JSON بأمان من localStorage
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
 * تحميل بيانات المستخدم عند تسجيل الدخول تلقائيًا
 */
export const loadUserData = (user, dispatch) => {
  if (!user) return;

  // دمج سلة الضيف مع سلة المستخدم
  const guestCart = safeParse("cart_guest", []);
  const userCartKey = `cart_${user.id}`;
  const userCart = safeParse(userCartKey, []);
  const mergedCart = [...userCart];

  guestCart.forEach(item => {
    const existing = mergedCart.find(i => i.id === item.id);
    if (existing) existing.quantity += item.quantity;
    else mergedCart.push(item);
  });

  // حفظ السلة للمستخدم وحذف سلة الضيف
  localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
  localStorage.removeItem("cart_guest");

  // تحديث Redux
  dispatch(setUser(user.id));
  dispatch(setCartItemsDirect(mergedCart));

  // دمج تقييمات الضيف مع المستخدم
  const guestReviews = safeParse("reviews_guest", {});
  const userReviewsKey = `reviews_${user.id}`;
  const userReviews = safeParse(userReviewsKey, {});
  const mergedReviews = { ...userReviews, ...guestReviews };
  localStorage.setItem(userReviewsKey, JSON.stringify(mergedReviews));
  localStorage.removeItem("reviews_guest");

  // مباشرة تحديث Redux للتقييمات
  dispatch({ type: "reviews/setReviewsDirect", payload: mergedReviews });
};

/**
 * تسجيل خروج المستخدم
 */
export const handleLogout = (cartItems, dispatch, navigate, lang) => {
  // حفظ السلة الحالية كسلة ضيف
  const currentCart = cartItems || [];
  localStorage.setItem("cart_guest", JSON.stringify(currentCart));

  // تسجيل الخروج
  dispatch(logoutAction());

  // إعادة guest فارغة للـ Redux
  dispatch(setUser(null));
  dispatch(setCartItemsDirect([]));

  // إعادة تقييمات guest فارغة للـ Redux
  dispatch({ type: "reviews/setReviewsDirect", payload: {} });

  // إعادة التوجيه لصفحة تسجيل الدخول
  navigate(`/${lang}/login`, { replace: true });
};
