const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

const mongooseOptions = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000, 
};

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aarogyachain';
console.log(`[DB] Attempting to connect to: ${URI.split('@')[1] || 'localhost'}`);

mongoose.connect(URI, mongooseOptions)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('Starting server in fail-safe mode (limited functionality)...');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (DB CONNECTION FAILED)`));
    });
