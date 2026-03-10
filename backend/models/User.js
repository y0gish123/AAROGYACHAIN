const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    abhaNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['Patient', 'Doctor'], default: 'Patient' },
});

module.exports = mongoose.model('User', userSchema);
