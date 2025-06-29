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
const MONGODB_URI = 'mongodb+srv://ankeshkr0921:kae8OXCW9x0Bgj5c@feebo.bttbi1o.mongodb.net/feebo?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000
    };

    console.log('Attempting to connect to MongoDB Atlas...');
    const conn = await mongoose.connect(MONGODB_URI, options);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName,
      stack: error.stack
    });
    
    // Retry connection
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Connect to MongoDB
connectDB();

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

const PORT = process.env.PORT || 5001;

// Start server regardless of DB connection
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', {
    name: err.name,
    message: err.message,
    code: err.code,
    codeName: err.codeName
  });
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
  // Attempt to reconnect
  setTimeout(connectDB, 5000);
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