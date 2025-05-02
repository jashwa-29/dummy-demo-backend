const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());    
// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// ✅ Correct way to import and use routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const authMiddleware = require('./middlewares/auth');
const sellerRoutes = require('./routes/sellerRoutes');
const adminRoutes = require("./routes/admin");
const orderRoutes = require("./routes/ordersRoutes");
const userOrderRoutes = require('./routes/userOrderRoutes');
const sellerProductRoutes = require('./routes/sellerProductRoutes');

app.use('/api/auth', authRoutes); // This must be a function, i.e., a Router
app.use('/api/products', productRoutes);
app.use('/api/cart', authMiddleware, cartRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/user', userOrderRoutes);
app.use('/api', sellerProductRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello from server!'); 

});

// DB + Server connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running at http://192.168.1.4:${PORT}`);
    });
  }) 
  .catch(err => console.error('❌ MongoDB error:', err));   
 