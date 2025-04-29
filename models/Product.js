const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  role: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  productInfo: { type: String, required: true },
  detailedInfo: { type: String, required: true }, // ✅ Added this field
  mainImage: { type: String, required: true },
  subImages: [{ type: String }],
  weight: [{ type: String, required: true }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);