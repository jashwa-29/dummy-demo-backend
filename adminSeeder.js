const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config(); // Loads .env variables

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL); // Removed deprecated options
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

connectDB();

(async () => {
  try {
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log("Admin already exists. Exiting seeder.");
      process.exit();
    }

    const admin = new Admin({ name: "Super Admin" });
    await admin.save();

    console.log("✅ Admin created successfully:");
    console.log("Username:", admin.username);
    console.log("Password:", admin._plainPassword); // Log this ONCE and save it
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
})();
