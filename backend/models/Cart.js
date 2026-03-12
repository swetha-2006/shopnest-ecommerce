// models/Cart.js
// Cart schema - one cart per user, contains array of items

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  price: {
    type: Number,
    required: true, // Stored at time of adding to cart
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
    // Virtual field to compute total price
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: calculate total cart price
cartSchema.virtual('totalPrice').get(function () {
  return this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
