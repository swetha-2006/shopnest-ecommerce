// components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to product page
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        <div className="product-card-overlay">
          <button
            className="btn btn-primary btn-sm overlay-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
        {product.stock === 0 && (
          <span className="out-of-stock-badge">Out of Stock</span>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="low-stock-badge">Only {product.stock} left!</span>
        )}
      </div>
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description.substring(0, 70)}...</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="product-stock">
            {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
