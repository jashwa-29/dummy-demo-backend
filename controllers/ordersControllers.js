const Order = require('../models/Orders');
const Cart = require('../models/Cart');
const User = require('../models/User');

// Create an order from the cart
const createOrderFromCart = async (req, res) => {
  try {
    const { userId, cartId, personalInfo, paymentMethod } = req.body;

    // Validate if userId and cartId are provided
    if (!userId || !cartId) {
      return res.status(400).json({ message: 'userId and cartId are required.' });
    }

    // Fetch the user's cart using cartId
    const cart = await Cart.findOne({ _id: cartId, userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty or not found.' });
    }

    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Create a new order from the cart
    const order = new Order({
      userId,
      cartItems: cart.items,
      personalInfo: {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phoneNumber: personalInfo.phoneNumber,
        companyName: personalInfo.companyName || null,
        companyAddress: personalInfo.companyAddress || null,
        country: personalInfo.country,
        address: personalInfo.address,
        houseNumberAndStreet: personalInfo.houseNumberAndStreet,
        apartment: personalInfo.apartment || null,
        townCity: personalInfo.townCity,
        city: personalInfo.city,
        state: personalInfo.state,
        zip: personalInfo.zip,
      },
      paymentMethod,
    });

    await order.save();

    // Optionally, clear the cart after the order is placed
    await Cart.findOneAndDelete({ _id: cartId });

    res.status(201).json({ message: 'Order created successfully.', order });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while placing the order.', error });
  }
};

// Create an order from Buy Now (for a single product)
const createOrderFromBuyNow = async (req, res) => {
  try {
    const { userId, productId, quantity, weight, personalInfo, paymentMethod } = req.body;

    // Validate if userId and productId are provided
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: 'userId, productId, and quantity are required.' });
    }

    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Create a new order from the Buy Now product
    const order = new Order({
      userId,
      cartItems: [
        {
          productId,
          quantity,
          weight,
        },
      ],
      personalInfo: {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phoneNumber: personalInfo.phoneNumber,
        companyName: personalInfo.companyName || null,
        companyAddress: personalInfo.companyAddress || null,
        country: personalInfo.country,
        address: personalInfo.address,
        houseNumberAndStreet: personalInfo.houseNumberAndStreet,
        apartment: personalInfo.apartment || null,
        townCity: personalInfo.townCity,
        city: personalInfo.city,
        state: personalInfo.state,
        zip: personalInfo.zip,
      },
      paymentMethod,
    });

    await order.save();

    res.status(201).json({ message: 'Order created successfully.', order });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while placing the order.', error });
  }
};

// Update the status of an order (for admin or user)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // Status should be one of ['Pending', 'Shipped', 'Delivered', 'Cancelled']

    // Validate the status
    if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    // Find and update the order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({ message: 'Order status updated successfully.', order });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the order status.', error });
  }
};

// Get all orders (for admin or user)
const getAllOrders = async (req, res) => {
    try {
      // Fetch all orders without filtering by userId
      const orders = await Order.find().populate('cartItems.productId'); // Populating product info in cartItems
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found.' });
      }
  
      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the orders.', error });
    }
  };

// Delete an order by its ID
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({ message: 'Order deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the order.', error });
  }
};

module.exports = { createOrderFromCart, createOrderFromBuyNow, updateOrderStatus, getAllOrders, deleteOrder };
