const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const adminAuth = require("../middlewares/adminAuth");
const sellerAuth = require("../middlewares/verifySeller");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategoryProducts
} = require('../controllers/productController');

// Upload config: one main image, multiple sub images
router.post(
  '/admin', adminAuth,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 }
  ]),
  addProduct
);

// Seller creating a product
router.post(
  '/seller', sellerAuth,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 }
  ]),
  addProduct
);

router.get('/category', getCategoryProducts); // FIRST
router.get('/', getAllProducts);              // SECOND
router.get('/:id', getProductById);            // LAST
// Admin updating a product
router.put(
  '/admin/:id', adminAuth,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 }
  ]),
  updateProduct
);

// Seller updating a product
router.put(
  '/seller/:id', sellerAuth,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 }
  ]),
  updateProduct
);

// Admin deleting a product
router.delete('/admin/:id', adminAuth, deleteProduct);

// Seller deleting their product
router.delete('/seller/:id', sellerAuth, deleteProduct);

module.exports = router;
