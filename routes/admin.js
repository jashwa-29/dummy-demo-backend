const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin } = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");
const bcrypt = require("bcryptjs");

// router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Example: Protected admin route
router.get("/dashboard", adminAuth, (req, res) => {
  res.status(200).json({ message: "Welcome Admin", admin: req.admin });
});

module.exports = router;
