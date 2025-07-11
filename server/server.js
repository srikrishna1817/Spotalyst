const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load .env variables
dotenv.config();

const app = express();

// Middleware to parse JSON and handle cross-origin requests
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Default test route
app.get('/', (req, res) => {
  res.send('Smart Spot Explorer API is running');
});


// Route Imports
const spotRoutes = require('./routes/spotRoutes');
const activityRoutes = require('./routes/activityRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes'); // optional

// Use Routes
app.use('/api', spotRoutes);
app.use('/api', activityRoutes);
app.use('/api', feedbackRoutes); // optional


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
