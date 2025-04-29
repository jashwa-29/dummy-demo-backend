const Seller = require('../models/Seller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup a new seller
exports.signup = async (req, res) => {
  const { username, email, password, gstNumber, phone, address } = req.body;

  try {
    // Check if seller already exists by email
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Seller already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new seller
    const newSeller = new Seller({
      username,
      email,
      password: hashedPassword,
      gstNumber,
      phone,
      address
    });

    await newSeller.save();
    res.status(201).json({ message: 'Seller registered successfully' });

  } catch (error) {
    console.error('Error signing up seller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Sign in an existing seller
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the seller by email
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d', // Use environment variable for expiry
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      seller: {
        id: seller._id,
        username: seller.username,
        email: seller.email,
        gstNumber: seller.gstNumber,
        phone: seller.phone,
        address: seller.address,
      }
    });
  } catch (error) {
    console.error('Error signing in seller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
