const Spot = require('../models/Spot');
const axios = require('axios');

// GET all spots
const getAllSpots = async (req, res) => {
  try {
    const spots = await Spot.find();
    res.status(200).json(spots);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch spots', error });
  }
};

// POST a new spot and call n8n
const createSpot = async (req, res) => {
  try {
    // Save the spot to MongoDB
    const newSpot = new Spot(req.body);
    await newSpot.save();

    // 🔗 Replace this with your actual n8n webhook URL
    const n8nWebhookURL = //webhook url
    let itinerary = '';

    try {
      // Send the spot data to n8n
      const response = await axios.post(n8nWebhookURL, req.body);
      itinerary = response.data.plan || response.data || '';
    } catch (n8nError) {
      console.error('Error calling n8n:', n8nError.message);
    }

    // Send response back to frontend
    res.status(201).json({
      message: 'Spot created successfully',
      spot: newSpot,
      itinerary
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to create spot', error });
  }
};

// DELETE a spot by ID
const deleteSpot = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSpot = await Spot.findByIdAndDelete(id);
    if (!deletedSpot) {
      return res.status(404).json({ message: 'Spot not found' });
    }
    res.status(200).json({ message: 'Spot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete spot', error });
  }
};

// BULK insert spots
const createManySpots = async (req, res) => {
  try {
    await Spot.insertMany(req.body);
    res.status(201).json({ message: 'Spots added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to insert spots', error });
  }
};

module.exports = {
  getAllSpots,
  createSpot,
  deleteSpot,
  createManySpots
};
