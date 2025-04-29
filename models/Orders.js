const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      weight: {
        type: String,
        required: true,
      },
    },
  ],
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    companyName: { type: String, default: null },
    companyAddress: { type: String, default: null },
    country: { type: String, required: true },
    address: { type: String, required: true },
    houseNumberAndStreet: { type: String, required: true },
    apartment: { type: String, default: null },
    townCity: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  paymentMethod: {
    type: String, // e.g., 'Credit Card', 'PayPal'
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
