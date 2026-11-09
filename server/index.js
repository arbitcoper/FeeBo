const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const feedbackRoutes = require('./routes/feedback');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ankeshkr0921:kae8OXCW9x0Bgj5c@feebo.bttbi1o.mongodb.net/feebo?retryWrites=true&w=majority';

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!cachedPromise) {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000
    };

    console.log('Attempting to connect to MongoDB Atlas...');
    cachedPromise = mongoose.connect(MONGODB_URI, options)
      .then((conn) => {
        console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        cachedPromise = null;
        console.error('MongoDB connection error:', {
          name: error.name,
          message: error.message,
          code: error.code
        });
        throw error;
      });
  }

  return cachedPromise;
};

// Ensure database is connected before handling any API request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed on request:', error.message);
    res.status(503).json({
      message: 'Database connection failed. Please ensure MONGODB_URI is configured and MongoDB Atlas allows connections from anywhere (0.0.0.0/0).',
      error: error.message
    });
  }
});

// Routes
app.use('/api/feedback', feedbackRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'FeeBo API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    name: err.name,
    code: err.code,
    stack: err.stack,
    body: req.body
  });
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Only listen directly when not running in Vercel serverless environment
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Handle server shutdown
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      server.close(() => {
        console.log('Server closed. Database instance disconnected');
        process.exit(0);
      });
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
}

// Export Express app for Vercel Serverless Function
module.exports = app;
