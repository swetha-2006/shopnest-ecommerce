// context/CartContext.js
// Global cart state management

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [cartLoading, setCartLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], totalPrice: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const { data } = await cartService.getCart();
      setCart(data.cart || { items: [], totalPrice: 0 });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await cartService.addItem(productId, quantity);
    setCart(data.cart);
    return data;
  };

  const removeFromCart = async (productId) => {
    const { data } = await cartService.removeItem(productId);
    setCart(data.cart);
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await cartService.updateItem(productId, quantity);
    setCart(data.cart);
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart({ items: [], totalPrice: 0 });
  };

  // Compute cart totals
  const cartItemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        cartItemCount,
        cartTotal,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
