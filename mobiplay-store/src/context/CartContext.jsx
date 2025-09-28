// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

// Create a Context for the shopping cart
const CartContext = createContext();

// CartProvider component to wrap the app and provide cart state
export const CartProvider = ({ children }) => {
  // Initialize cartItems state from localStorage or empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Update localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add a product to the cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // If product already exists, increase quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Otherwise, add new product to cart
      return [...prev, { ...product, quantity }];
    });
  };

  // Remove a product from the cart by ID
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update quantity of a specific product
  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // Increase quantity of a product by 1
  const increaseQuantity = (id) => {
    const currentQty = cartItems.find((item) => item.id === id)?.quantity || 1;
    updateQuantity(id, currentQty + 1);
  };

  // Decrease quantity of a product by 1 (minimum 1)
  const decreaseQuantity = (id) => {
    const currentQty = cartItems.find((item) => item.id === id)?.quantity || 1;
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  // Clear the entire cart
  const clearCart = () => setCartItems([]);

  // Compute the total price using useMemo for optimization
  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + (item.discountedPrice ?? item.price ?? 0) * (item.quantity ?? 0),
        0
      ),
    [cartItems]
  );

  // Provide all cart functions and state to child components
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

// Custom hook to easily access the cart context in components
export const useCart = () => useContext(CartContext);
