import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

const CART_KEY = 'spareshop_cart';
const CART_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in ms

export function CartProvider({ children }) {
  // Load cart from localStorage and check expiry
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.createdAt && Date.now() - parsed.createdAt > CART_EXPIRY) {
          localStorage.removeItem(CART_KEY);
          return [];
        }
        return parsed.items || [];
      } catch {
        localStorage.removeItem(CART_KEY);
        return [];
      }
    }
    return [];
  });

  // Save cart to localStorage on change
  useEffect(() => {
    if (cart.length === 0) {
      localStorage.removeItem(CART_KEY);
    } else {
      const saved = localStorage.getItem(CART_KEY);
      let createdAt = Date.now();
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.createdAt) createdAt = parsed.createdAt;
        } catch {}
      }
      localStorage.setItem(CART_KEY, JSON.stringify({ items: cart, createdAt }));
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        if (found.qty < (product.stock ?? Infinity)) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return prev;
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const updateQty = (id, qty, stock) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, Math.min(qty, item.stock ?? stock ?? Infinity)) }
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotal, updateQty }}>
      {children}
    </CartContext.Provider>
  );
} 