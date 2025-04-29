const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  editItemInCart

} = require('../controllers/cartController');

// POST: Add product to cart
router.post('/add', addToCart);

// GET: Get user's cart
router.get('/:userId', getCart);

// DELETE: Remove item from cart
router.delete('/remove', removeFromCart);
router.put('/edit/:userId', editItemInCart);

// DELETE: Clear entire cart
router.delete('/clear/:userId', clearCart);



module.exports = router;
