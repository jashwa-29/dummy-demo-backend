const express = require('express');
const router = express.Router();
const { createOrderFromCart, createOrderFromBuyNow, updateOrderStatus, getAllOrders, deleteOrder } = require('../controllers/ordersControllers');

// Route to create an order from the cart
router.post('/order/cart', createOrderFromCart);

// Route to create an order from Buy Now
router.post('/order/buynow', createOrderFromBuyNow);

// Route to update the order status (for admin or user)
router.put('/order/:orderId/status', updateOrderStatus);

// Route to get all orders (for admin or user)
router.get('/orders', getAllOrders);

// Route to delete an order by its ID
router.delete('/order/:orderId', deleteOrder);

module.exports = router;
