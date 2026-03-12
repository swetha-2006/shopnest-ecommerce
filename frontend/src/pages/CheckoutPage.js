// pages/CheckoutPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/api';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const { fullName, address, city, postalCode, country } = shippingAddress;
    if (!fullName || !address || !city || !postalCode || !country) {
      setError('Please fill in all shipping fields');
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      const { data } = await orderService.create({
        shippingAddress,
        paymentMethod: 'Cash on Delivery',
      });

      // Cart is cleared by backend; sync locally
      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shipping = cartTotal > 100 ? 0 : 9.99;
  const total = cartTotal + shipping;

  return (
    <div className="container page-wrapper">
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">Complete your purchase</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="checkout-layout">
        {/* Shipping form */}
        <div className="checkout-form card">
          <h3 className="section-title">Shipping Information</h3>
          <form onSubmit={handleSubmit} id="checkout-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={shippingAddress.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleChange}
                placeholder="123 Main Street, Apt 4B"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  placeholder="New York"
                  required
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  placeholder="10001"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleChange}
                placeholder="United States"
                required
              />
            </div>
          </form>

          <h3 className="section-title" style={{ marginTop: '32px' }}>Payment Method</h3>
          <div className="payment-option selected">
            <span>💵</span>
            <div>
              <strong>Cash on Delivery</strong>
              <p>Pay when your order arrives</p>
            </div>
            <span className="radio-dot"></span>
          </div>
        </div>

        {/* Order summary */}
        <div className="checkout-summary">
          <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h3 className="section-title">Order Items</h3>
            <div className="checkout-items">
              {cart.items?.map((item) => (
                <div key={item.product?._id} className="checkout-item">
                  <img src={item.product?.image} alt={item.product?.name} />
                  <div className="checkout-item-info">
                    <p className="checkout-item-name">{item.product?.name}</p>
                    <p className="checkout-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="checkout-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 className="section-title">Price Summary</h3>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              form="checkout-form"
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '16px' }}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : `Place Order · $${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
