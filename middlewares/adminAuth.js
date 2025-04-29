const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Admin token missing or unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    
    // Optionally verify if role is admin or match with your Admin model
    if (!decoded || !decoded.id || !decoded.username) {
      return res.status(403).json({ error: "Invalid admin token" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired admin token" });
  }
};

module.exports = adminAuth;
