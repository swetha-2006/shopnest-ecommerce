// pages/OrderHistoryPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await orderService.getUserOrders();
        setOrders(data.orders);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    const map = {
      Pending: 'badge-pending',
      Processing: 'badge-processing',
      Shipped: 'badge-shipped',
      Delivered: 'badge-delivered',
      Cancelled: 'badge-cancelled',
    };
    return `badge ${map[status] || 'badge-pending'}`;
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="container page-wrapper">
      <h1 className="page-title">My Orders</h1>
      <p className="page-subtitle">Track and manage your purchase history</p>

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📦</div>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders. Start shopping!</p>
          <Link to="/" className="btn btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card card">
              {/* Order header */}
              <div
                className="order-header"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="order-meta">
                  <div className="order-id">
                    <span className="order-label">Order</span>
                    <span className="order-number">#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>

                <div className="order-summary-right">
                  <span className={getStatusBadgeClass(order.orderStatus)}>
                    {order.orderStatus}
                  </span>
                  <span className="order-total">${order.totalPrice.toFixed(2)}</span>
                  <span className="expand-icon">{expandedOrder === order._id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expanded order details */}
              {expandedOrder === order._id && (
                <div className="order-details">
                  <div className="order-details-grid">
                    {/* Items */}
                    <div className="order-items-section">
                      <h4>Items Ordered</h4>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="order-item-img" />
                          )}
                          <div className="order-item-info">
                            <p className="order-item-name">{item.name}</p>
                            <p className="order-item-qty">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                          </div>
                          <span className="order-item-subtotal">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping address */}
                    <div className="order-shipping-section">
                      <h4>Shipping Address</h4>
                      <div className="address-block">
                        <p><strong>{order.shippingAddress?.fullName}</strong></p>
                        <p>{order.shippingAddress?.address}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                        <p>{order.shippingAddress?.country}</p>
                      </div>

                      <h4 style={{ marginTop: '20px' }}>Payment</h4>
                      <p className="payment-method-text">{order.paymentMethod}</p>

                      <div className="order-price-breakdown">
                        <div className="price-row">
                          <span>Subtotal</span>
                          <span>${order.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="price-row total">
                          <span>Total</span>
                          <span>${order.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
