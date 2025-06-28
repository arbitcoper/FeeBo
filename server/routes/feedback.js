const express = require('express');
const router = express.Router();
const { getAllFeedback, createFeedback } = require('../controllers/feedback');

// Get all feedback
router.get('/', getAllFeedback);

// Create new feedback
router.post('/', createFeedback);

module.exports = router; 