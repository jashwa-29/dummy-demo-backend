// controllers/userOrderController.js

const Order = require('../models/Orders'); // adjust path if needed

// 1. Get all orders of a user
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    const orders = await Order.find({ userId }).populate('cartItems.productId');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'An error occurred while fetching the user orders.', error });
  }
};

// 2. Cancel (delete) a user's order
const cancelUserOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    if (!userId || !orderId) {
      return res.status(400).json({ message: 'userId and orderId are required.' });
    }

    // Find the order
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have permission to cancel this order.' });
    }

    // Delete the order
    await Order.deleteOne({ _id: orderId });

    res.status(200).json({ message: 'Order canceled successfully.' });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ message: 'An error occurred while canceling the order.', error });
  }
};

module.exports = { getUserOrders, cancelUserOrder };
