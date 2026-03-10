const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    abhaNumber: { type: String, required: true },
    patientName: { type: String, required: true },
    reportType: { type: String, required: true },
    ipfsUrl: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    summary: { type: String } // For AI analysis
});

module.exports = mongoose.model('Report', reportSchema);
