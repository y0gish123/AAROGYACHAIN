const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aarogyachain')
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error (Starting server anyway for UI testing):', err.message);
        app.listen(PORT, () => console.log(`Server running on port ${PORT} (WITHOUT DATABASE)`));
    });
