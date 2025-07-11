// routes/spotRoutes.js
const express = require('express');
const router = express.Router();
const { getAllSpots, createSpot, deleteSpot, createManySpots } = require('../controllers/spotController');

// Routes
router.get('/spots', getAllSpots);
router.post('/spots', createSpot);
router.delete('/spots/:id', deleteSpot);

// ✅ Bulk insert route
router.post('/spots/bulk', createManySpots);

module.exports = router;
