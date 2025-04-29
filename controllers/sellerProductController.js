const SellerProduct = require('../models/sellerProduct');
const Seller = require('../models/Seller');
const Product = require('../models/Product');

// Controller to add a seller-product relationship
exports.addSellerProduct = async (req, res) => {
  try {
    const { sellerId, productId } = req.body;

    // Check if the seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the relationship already exists
    const existingRelationship = await SellerProduct.findOne({ seller: sellerId, product: productId });
    if (existingRelationship) {
      return res.status(400).json({ message: 'This product is already associated with this seller' });
    }

    // Create a new seller-product relationship
    const newSellerProduct = new SellerProduct({ seller: sellerId, product: productId });
    await newSellerProduct.save();

    res.status(201).json({ message: 'Product successfully associated with seller', data: newSellerProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get all products associated with a specific seller
exports.getProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    // Fetch the products associated with the seller
    const sellerProducts = await SellerProduct.find({ seller: sellerId }).populate('product');
    if (sellerProducts.length === 0) {
      return res.status(404).json({ message: 'No products found for this seller' });
    }

    res.status(200).json(sellerProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
