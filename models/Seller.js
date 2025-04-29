const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gstNumber:{ type: String, required: true },
  phone:    { type: String, required: true },
  address:  { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
