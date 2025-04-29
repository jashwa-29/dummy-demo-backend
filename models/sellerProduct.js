const mongoose = require('mongoose');

const sellerProductSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
}, { timestamps: true });

module.exports = mongoose.model('SellerProduct', sellerProductSchema);
