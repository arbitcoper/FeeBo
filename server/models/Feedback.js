const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  subCategory: {
    type: String,
    required: [true, 'Sub-category is required'],
    trim: true
  },
  metaCategory: {
    type: String,
    required: [true, 'Meta-category is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
feedbackSchema.index({ category: 1, subCategory: 1, metaCategory: 1 });
feedbackSchema.index({ createdAt: -1 });

// Update the updatedAt timestamp before saving
feedbackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-save middleware for additional validation
feedbackSchema.pre('save', function(next) {
  // Additional validation can be added here
  next();
});

// Error handling middleware
feedbackSchema.post('save', function(error, doc, next) {
  if (error.name === 'ValidationError') {
    next(new Error(Object.values(error.errors).map(val => val.message).join(', ')));
  } else if (error.code === 11000) {
    next(new Error('Duplicate entry found'));
  } else {
    next(error);
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback; 