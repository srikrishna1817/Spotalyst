const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: String,
  type: String, // ✅ New: e.g., Heritage, Religious, Adventure
  description: String,
  recommendedTime: {
    type: Number,
    required: true
  },
  targetAudience: [String], // ✅ New: e.g., ["Family", "Friends"]
  tags: [String], // Optional additional metadata
  location: {
    lat: Number,
    lng: Number
  },
  openHours: String,
  email: String, // User email
  startTime: String, // e.g., "10:00" - when user plans to start
  entryFee: Number
});

module.exports = mongoose.model('Spot', spotSchema);
