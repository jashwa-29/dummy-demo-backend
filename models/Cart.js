const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
    unique: true, // Ensure each user can only have one cart
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to Product model
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },

      weight: {
        type: String,
        default: 1,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
