const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // to parse JSON bodies

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Hello0000000000000 from server!');
});
   
// Start server 
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
