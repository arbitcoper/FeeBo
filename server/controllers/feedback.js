const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

// Import categories
const CATEGORIES = [
  {
    name: "Electronics & Gadgets",
    metaCategory: "Consumer Tech",
    subCategories: [
      { name: "Mobile Phones" },
      { name: "Laptops" },
      { name: "Tablets" },
      { name: "Wearables" },
      { name: "Audio Devices" }
    ]
  },
  {
    name: "Reading & Learning",
    metaCategory: "Educational",
    subCategories: [
      { name: "Books" },
      { name: "Online Courses" },
      { name: "Tutorials" },
      { name: "Documentation" },
      { name: "Learning Platforms" }
    ]
  },
  {
    name: "Entertainment",
    metaCategory: "Media & Content",
    subCategories: [
      { name: "Movies" },
      { name: "Web Series" },
      { name: "TV Shows" },
      { name: "Music" },
      { name: "Games" }
    ]
  },
  {
    name: "Tools & Apps",
    metaCategory: "Software",
    subCategories: [
      { name: "Mobile Apps" },
      { name: "Desktop Software" },
      { name: "Web Apps" },
      { name: "AI Tools" },
      { name: "Browser Extensions" }
    ]
  },
  {
    name: "General Suggestions",
    metaCategory: "Miscellaneous",
    subCategories: [
      { name: "Website Feedback" },
      { name: "Service Feedback" },
      { name: "Feature Requests" },
      { name: "Bug Reports" },
      { name: "Other" }
    ]
  }
];

// Helper function to check DB connection
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Public
exports.getAllFeedback = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ 
        message: 'Database connection not ready. Please try again in a few moments.' 
      });
    }

    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ 
      message: 'Error fetching feedback', 
      error: error.message 
    });
  }
};

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Public
exports.getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.author', 'username');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private
exports.createFeedback = async (req, res) => {
  try {
    if (!isDbConnected()) {
      console.log('Database connection not ready');
      return res.status(503).json({ 
        message: 'Database connection not ready. Please try again in a few moments.' 
      });
    }

    console.log('Received feedback data:', JSON.stringify(req.body, null, 2));
    const { title, description, category, subCategory } = req.body;

    // Log the connection state
    console.log('MongoDB Connection State:', mongoose.connection.readyState);
    console.log('MongoDB Connected to:', mongoose.connection.host);

    // Validate required fields
    const requiredFields = { title, description, category, subCategory };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Get meta category from the category
    const currentCategory = CATEGORIES.find(cat => cat.name === category);
    if (!currentCategory) {
      console.log('Invalid category:', category);
      return res.status(400).json({
        message: 'Invalid category selected'
      });
    }

    // Validate subcategory
    const isValidSubCategory = currentCategory.subCategories.some(sub => sub.name === subCategory);
    if (!isValidSubCategory) {
      console.log('Invalid subcategory:', subCategory);
      return res.status(400).json({
        message: 'Invalid subcategory selected'
      });
    }

    // Create new feedback document
    const feedback = new Feedback({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      subCategory: subCategory.trim(),
      metaCategory: currentCategory.metaCategory
    });

    console.log('Attempting to save feedback:', JSON.stringify(feedback.toObject(), null, 2));
    
    // Validate the document before saving
    const validationError = feedback.validateSync();
    if (validationError) {
      console.log('Validation error:', validationError);
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(validationError.errors).map(err => err.message)
      });
    }

    const savedFeedback = await feedback.save();
    console.log('Feedback saved successfully:', JSON.stringify(savedFeedback.toObject(), null, 2));
    
    return res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error creating feedback:', {
      message: error.message,
      name: error.name,
      code: error.code,
      errors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : undefined,
      stack: error.stack
    });

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    // Handle MongoDB connection errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(503).json({
        message: 'Database error. Please try again in a few moments.',
        details: error.message
      });
    }

    // Handle network timeouts
    if (error.name === 'MongoTimeoutError') {
      return res.status(504).json({
        message: 'Database operation timed out. Please try again.',
        details: error.message
      });
    }

    return res.status(500).json({
      message: `Error creating feedback: ${error.message}. Please try again.`
    });
  }
};

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private
exports.updateFeedback = async (req, res, next) => {
  try {
    let feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Make sure user owns feedback or is admin
    if (feedback.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this feedback' });
    }

    feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username');

    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Make sure user owns feedback or is admin
    if (feedback.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }

    await feedback.remove();

    res.json({ message: 'Feedback removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Vote on feedback
// @route   POST /api/feedback/:id/vote
// @access  Private
exports.voteFeedback = async (req, res, next) => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if user has already voted
    const existingVote = feedback.votes.find(
      vote => vote.user.toString() === req.user._id.toString()
    );

    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote if same type
        feedback.votes = feedback.votes.filter(
          vote => vote.user.toString() !== req.user._id.toString()
        );
      } else {
        // Change vote type
        existingVote.type = type;
      }
    } else {
      // Add new vote
      feedback.votes.push({
        user: req.user._id,
        type
      });
    }

    // Update vote count
    feedback.voteCount = feedback.votes.reduce((acc, vote) => {
      return acc + (vote.type === 'upvote' ? 1 : -1);
    }, 0);

    await feedback.save();

    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to feedback
// @route   POST /api/feedback/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.comments.unshift({
      text,
      author: req.user._id
    });

    await feedback.save();

    const populatedFeedback = await Feedback.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.author', 'username');

    res.json(populatedFeedback);
  } catch (error) {
    next(error);
  }
}; 