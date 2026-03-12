// pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { productService, orderService } from '../services/api';
import './AdminDashboard.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Other'];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'Electronics',
  image: '',
  stock: '',
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        productService.getAll({ limit: 100 }),
        orderService.getAllOrders(),
      ]);
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data.orders);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setFormData(emptyForm);
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || '',
      stock: product.stock,
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        await productService.update(editingProduct._id, payload);
        toast.success('Product updated successfully!');
      } else {
        await productService.create(payload);
        toast.success('Product created successfully!');
      }

      setShowForm(false);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await productService.delete(productId);
      toast.success('Product deleted');
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      toast.success('Order status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  // Stats
  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="container page-wrapper">
      <div className="admin-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage your store</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon">📦</div>
          <div>
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">🛒</div>
          <div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">💰</div>
          <div>
            <div className="stat-value">${totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
        <div className="stat-card card">
          <div className="stat-icon">🏭</div>
          <div>
            <div className="stat-value">{totalStock}</div>
            <div className="stat-label">Items in Stock</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {/* Products tab */}
      {activeTab === 'products' && (
        <div className="admin-section">
          <div className="section-header">
            <h3>Products ({products.length})</h3>
            <button className="btn btn-primary" onClick={openCreateForm}>
              + Add Product
            </button>
          </div>

          {/* Product form modal */}
          {showForm && (
            <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
              <div className="modal card">
                <div className="modal-header">
                  <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="product-form">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" required />
                  </div>
                  <div className="form-row-3">
                    <div className="form-group">
                      <label>Price ($) *</label>
                      <input type="number" name="price" value={formData.price} onChange={handleFormChange} min="0" step="0.01" required />
                    </div>
                    <div className="form-group">
                      <label>Stock *</label>
                      <input type="number" name="stock" value={formData.stock} onChange={handleFormChange} min="0" required />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select name="category" value={formData.category} onChange={handleFormChange}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="url" name="image" value={formData.image} onChange={handleFormChange} placeholder="https://..." />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={formLoading}>
                      {formLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete confirm */}
          {deleteConfirm && (
            <div className="modal-overlay">
              <div className="modal card confirm-modal">
                <h3>Delete Product?</h3>
                <p>This action cannot be undone.</p>
                <div className="form-actions">
                  <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                </div>
              </div>
            </div>
          )}

          {/* Products table */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-cell">
                        <img src={product.image} alt={product.name} className="product-thumb" />
                        <div>
                          <p className="product-cell-name">{product.name}</p>
                          <p className="product-cell-id">#{product._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="category-tag">{product.category}</span></td>
                    <td className="price-cell">${product.price.toFixed(2)}</td>
                    <td>
                      <span className={`stock-cell ${product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : 'ok'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-outline btn-sm" onClick={() => openEditForm(product)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setDeleteConfirm(product._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders tab */}
      {activeTab === 'orders' && (
        <div className="admin-section">
          <div className="section-header">
            <h3>Orders ({orders.length})</h3>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="order-id-cell">#{order._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <p className="customer-name">{order.userId?.name}</p>
                      <p className="customer-email">{order.userId?.email}</p>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="price-cell">${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${order.orderStatus?.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={order.orderStatus}
                        onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                      >
                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
