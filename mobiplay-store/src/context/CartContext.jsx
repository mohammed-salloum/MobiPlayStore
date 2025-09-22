// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // استرجاع السلة من localStorage عند أول تحميل
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // تحديث localStorage عند أي تغيير في السلة
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // إضافة منتج للسلة
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  // إزالة منتج من السلة
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // تعديل كمية منتج معين
  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // زيادة الكمية
  const increaseQuantity = (id) => {
    const currentQty = cartItems.find((item) => item.id === id)?.quantity || 1;
    updateQuantity(id, currentQty + 1);
  };

  // نقصان الكمية (ما بتنزل عن 1)
  const decreaseQuantity = (id) => {
    const currentQty = cartItems.find((item) => item.id === id)?.quantity || 1;
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  // مسح كامل السلة
  const clearCart = () => setCartItems([]);

  // حساب السعر الإجمالي
  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + (item.discountedPrice ?? item.price ?? 0) * (item.quantity ?? 0),
        0
      ),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook لاستخدام السلة بسهولة
export const useCart = () => useContext(CartContext);
