// pages/ProductDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await productService.getById(id);
        setProduct(data.product);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;
  if (error) return <div className="container page-wrapper"><div className="alert alert-error">{error}</div></div>;
  if (!product) return null;

  return (
    <div className="container page-wrapper">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Shop
      </button>

      <div className="product-detail-layout">
        {/* Image */}
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
          {product.stock === 0 && (
            <div className="sold-out-overlay">Out of Stock</div>
          )}
        </div>

        {/* Info */}
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-price">${product.price.toFixed(2)}</div>

          <p className="product-detail-description">{product.description}</p>

          <div className="stock-info">
            <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="quantity-row">
              <label className="qty-label">Quantity:</label>
              <div className="quantity-controls">
                <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          <div className="product-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
            >
              {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            {isAuthenticated && product.stock > 0 && (
              <button
                className="btn btn-dark btn-lg"
                onClick={async () => {
                  await handleAddToCart();
                  navigate('/cart');
                }}
              >
                Buy Now
              </button>
            )}
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Stock</span>
              <span className="meta-value">{product.stock} units</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Listed</span>
              <span className="meta-value">{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
