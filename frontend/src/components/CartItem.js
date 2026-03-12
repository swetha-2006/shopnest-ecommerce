// components/CartItem.js
import React from 'react';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = async (newQty) => {
    if (newQty < 1) return;
    const maxStock = item.product?.stock || 99;
    if (newQty > maxStock) {
      toast.warning(`Only ${maxStock} items available`);
      return;
    }
    try {
      await updateQuantity(item.product._id, newQty);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item.product._id);
      toast.info('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (!item.product) return null;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.product.image} alt={item.product.name} />
      </div>

      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.product.name}</h4>
        <p className="cart-item-price">${item.price.toFixed(2)} each</p>
      </div>

      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button
            className="qty-btn"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button
            className="qty-btn"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <span className="cart-item-subtotal">
          ${(item.price * item.quantity).toFixed(2)}
        </span>

        <button className="remove-btn" onClick={handleRemove} aria-label="Remove item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
