import { createSlice } from "@reduxjs/toolkit";

// احصل على المستخدم الحالي أو guest
const savedUser = JSON.parse(localStorage.getItem("user"));
const userId = savedUser ? savedUser.id : null;

const getCartFromStorage = (id) => {
  const key = id ? `cart_${id}` : "cart_guest";
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: getCartFromStorage(userId),
  userId: userId,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const newUserId = action.payload;

      if (!newUserId) {
        // تسجيل خروج → حفظ السلة الحالية ثم استرجاع سلة guest
        const key = state.userId ? `cart_${state.userId}` : "cart_guest";
        localStorage.setItem(key, JSON.stringify(state.items));

        state.userId = null;
        state.items = getCartFromStorage(null);
        return;
      }

      // تسجيل دخول → دمج سلة guest مع سلة المستخدم
      const guestCart = getCartFromStorage(null);
      const userCart = getCartFromStorage(newUserId);

      const mergedCart = [...userCart];
      guestCart.forEach(item => {
        const existing = mergedCart.find(i => i.id === item.id);
        if (existing) existing.quantity += item.quantity;
        else mergedCart.push(item);
      });

      state.userId = newUserId;
      state.items = mergedCart;

      localStorage.setItem(`cart_${newUserId}`, JSON.stringify(mergedCart));
      localStorage.removeItem("cart_guest");
    },

    setCartItemsDirect: (state, action) => {
      state.items = action.payload;
      const key = state.userId ? `cart_${state.userId}` : "cart_guest";
      localStorage.setItem(key, JSON.stringify(state.items));
    },

    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find(i => i.id === product.id);
      if (existing) existing.quantity += quantity;
      else state.items.push({ ...product, quantity });

      const key = state.userId ? `cart_${state.userId}` : "cart_guest";
      localStorage.setItem(key, JSON.stringify(state.items));
    },

    setQuantityExact: (state, action) => {
      const { id, quantity } = action.payload;
      const existing = state.items.find(i => i.id === id);
      if (existing) existing.quantity = Math.max(1, quantity);

      const key = state.userId ? `cart_${state.userId}` : "cart_guest";
      localStorage.setItem(key, JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      const key = state.userId ? `cart_${state.userId}` : "cart_guest";
      localStorage.setItem(key, JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      const key = state.userId ? `cart_${state.userId}` : "cart_guest";
      localStorage.setItem(key, JSON.stringify([]));
    },
  },
});

export const { setUser, setCartItemsDirect, addToCart, removeFromCart, setQuantityExact, clearCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartUserId = (state) => state.cart.userId;

export default cartSlice.reducer;
