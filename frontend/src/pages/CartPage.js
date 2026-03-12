// pages/CartPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import './CartPage.css';

const CartPage = () => {
  const { cart, cartTotal, cartLoading, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartLoading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container page-wrapper">
        <div className="empty-state">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const subtotal = cartTotal;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="container page-wrapper">
      <h1 className="page-title">Shopping Cart</h1>
      <p className="page-subtitle">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart</p>

      <div className="cart-layout">
        {/* Cart items */}
        <div className="cart-items-section card">
          <div className="cart-items-header">
            <span>Product</span>
            <span>Subtotal</span>
          </div>
          <div className="cart-items-list">
            {cart.items.map((item) => (
              <CartItem key={item.product?._id} item={item} />
            ))}
          </div>
          <div className="cart-items-footer">
            <button className="btn btn-outline btn-sm clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
            <Link to="/" className="btn btn-outline btn-sm">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div className="cart-summary card">
          <h3 className="summary-title">Order Summary</h3>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-shipping">FREE</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="shipping-note">Free shipping on orders over $100</p>
            )}
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-primary btn-lg checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
