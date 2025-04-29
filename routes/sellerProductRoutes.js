const express = require('express');
const sellerProductController = require('../controllers/sellerProductController');

const router = express.Router();

// Route to associate a seller with a product
router.post('/seller-product', sellerProductController.addSellerProduct);

// Route to get all products associated with a specific seller
router.get('/seller/:sellerId/products', sellerProductController.getProductsBySeller);

module.exports = router;
