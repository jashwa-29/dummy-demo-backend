const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

// Helper to generate JWT
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      username: admin.username,
      role: "admin", // Optional: to differentiate in the future
    },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};
      
// // Register new admin
// exports.registerAdmin = async (req, res) => {
//   try {
//     const { name } = req.body;

//     const admin = new Admin({ name });
//     await admin.save();

//     const token = generateToken(admin);

//     res.status(201).json({
//       message: "Admin created successfully",
//       username: admin.username,
//       password: admin._plainPassword, // only returned once on creation
//       token,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Login existing admin
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(admin);

    res.status(200).json({
      message: "Login successful",
      adminId: admin._id,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
