// routes/userOrderRoutes.js

const express = require('express');
const router = express.Router();
const { getUserOrders, cancelUserOrder } = require('../controllers/userOrderController');

// GET orders for a specific user
router.get('/orders/:userId', getUserOrders);

// DELETE (cancel) a specific order by user
router.delete('/orders/:userId/:orderId', cancelUserOrder);

module.exports = router;
