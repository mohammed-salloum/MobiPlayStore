import { createSlice } from '@reduxjs/toolkit';

// الحالة الابتدائية للسلة (مصفوفة فارغة من العناصر)
const initialState = {
  items: [], // كل عنصر شكل: {id, name, price, quantity, img, ...}
};

const cartSlice = createSlice({
  name: 'cart', // اسم ال Slice
  initialState,
  reducers: {
    // إضافة منتج للسلة أو تحديث كميته (تعيين الكمية الجديدة بدل زيادة فقط)
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find(item => item.id === product.id);
      const qty = product.quantity && product.quantity > 0 ? product.quantity : 1;

      if (existing) {
        existing.quantity = qty;
      } else {
        state.items.push({ ...product, quantity: qty });
      }
    },

    // إزالة منتج من السلة حسب الـ id
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
    },

    // زيادة كمية منتج واحد في السلة
    increaseQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity += 1;
      }
    },

    // تقليل كمية منتج في السلة مع ضمان ألا تقل عن 1
    decreaseQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    // إفراغ السلة بالكامل
    clearCart(state) {
      state.items = [];
    }
  }
});

// تصدير الإجراءات لتستخدمها في المكونات
export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart
} = cartSlice.actions;

// تصدير ال reducer ليتم تسجيله في store
export default cartSlice.reducer;
