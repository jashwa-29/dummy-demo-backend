const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
}, { timestamps: true });

// Auto-generate username and password before saving
adminSchema.pre("save", async function (next) {
  if (!this.username) {
    this.username = "admin_" + Math.random().toString(36).substring(2, 8);
  }

  if (!this.password) {
    const randomPassword = Math.random().toString(36).slice(-8); // auto password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(randomPassword, salt);
    this._plainPassword = randomPassword; // Store in temp var to return once
  }

  next();
});

// Method to check password
adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
