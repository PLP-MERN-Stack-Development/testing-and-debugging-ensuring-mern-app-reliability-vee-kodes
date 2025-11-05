const express = require('express');
const cors = require('cors');
const bugRoutes = require('./src/routes/bugRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Routes
app.use('/api/bugs', bugRoutes);

// Root route 
app.get('/', (req, res) => {
  res.send('Bug Tracker API is running...');
});

// Error handler
app.use(errorHandler);

module.exports = app;
