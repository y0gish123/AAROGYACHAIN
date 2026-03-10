const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const User = require('../models/User'); // For Patient

// Temporary in-memory store for OTPs (for demo purposes)
const otpStore = {};

// Generate OTP
router.post('/patient/generate-otp', async (req, res) => {
    try {
        const { abhaNumber } = req.body;

        if (!abhaNumber) {
            return res.status(400).json({ success: false, message: 'ABHA Number is required' });
        }

        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store the OTP against the ABHA number (overwrites any existing)
        otpStore[abhaNumber] = otp;

        return res.json({ success: true, message: 'OTP generated successfully', otp });
    } catch (error) {
        console.error("Generate OTP Error:", error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Patient Login
router.post('/patient/login', async (req, res) => {
    try {
        const { abhaNumber, otp } = req.body;

        if (!abhaNumber || !otp) {
            return res.status(400).json({ success: false, message: 'ABHA Number and OTP are required' });
        }

        // Validate OTP
        if (otpStore[abhaNumber] !== otp) {
            return res.status(400).json({ success: false, message: 'Wrong OTP. Please try again.' });
        }

        // Clear OTP after successful validation
        delete otpStore[abhaNumber];

        // Upsert Patient or Fetch Patient (Fallback if DB is disconnected)
        let patient;
        try {
            // Check if mongoose is connected before querying to avoid long timeouts/errors
            if (mongoose.connection.readyState === 1) {
                patient = await User.findOne({ abhaNumber, role: 'Patient' });
                if (!patient) {
                    patient = await User.create({ abhaNumber, name: `Patient-${abhaNumber.slice(-4)}`, role: 'Patient' });
                }
            } else {
                throw new Error("Mongoose not connected");
            }
        } catch (dbError) {
            console.log("DB Error during patient login, using mock patient:", dbError.message);
            patient = { _id: "mock-id", abhaNumber, name: `Patient-${abhaNumber.slice(-4)}`, role: 'Patient' };
        }

        return res.json({ success: true, message: 'Patient login successful', patient });
    } catch (error) {
        console.error("Outer Patient Login Error:", error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Doctor Register
router.post('/doctor/register', async (req, res) => {
    try {
        const { fullName, uid, email, password, confirmPassword } = req.body;

        if (!fullName || !uid || !email || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        const existingDoctor = await Doctor.findOne({ uid });
        if (existingDoctor) {
            return res.status(400).json({ success: false, message: 'Doctor with this UID already exists' });
        }

        const existingDoctorEmail = await Doctor.findOne({ email });
        if (existingDoctorEmail) {
            return res.status(400).json({ success: false, message: 'Doctor with this Email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newDoctor = await Doctor.create({
            fullName,
            uid,
            email,
            password: hashedPassword
        });

        res.status(201).json({ success: true, message: 'Doctor registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Doctor Login
router.post('/doctor/login', async (req, res) => {
    try {
        const { uid, password } = req.body;

        if (!uid || !password) {
            return res.status(400).json({ success: false, message: 'UID and Password are required' });
        }

        let doctor;
        try {
            if (mongoose.connection.readyState === 1) {
                doctor = await Doctor.findOne({ uid });
            } else {
                throw new Error("Mongoose not connected");
            }
        } catch (dbError) {
            console.log("DB Error during doctor login, using mock doctor:", dbError.message);
            // In mock mode, we'll bypass real authentication and return a mock doctor object
            doctor = { _id: "mock-doc-id", fullName: "Mock Doctor", uid: uid, password: "mock-password" };
            return res.json({ success: true, message: 'Doctor login successful (Offline Mode)', doctor: { id: doctor._id, fullName: doctor.fullName, uid: doctor.uid } });
        }

        if (!doctor) {
            return res.status(400).json({ success: false, message: 'Invalid UID or Password' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid UID or Password' });
        }

        res.json({ success: true, message: 'Doctor login successful', doctor: { id: doctor._id, fullName: doctor.fullName, uid: doctor.uid } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Get Patient Info by ABHA
router.get('/patient/:abhaNumber', async (req, res) => {
    try {
        const { abhaNumber } = req.params;
        console.log(`Searching for patient with ABHA: ${abhaNumber}`);
        let patient;

        if (mongoose.connection.readyState === 1) {
            patient = await User.findOne({ abhaNumber, role: 'Patient' });
        }

        if (!patient) {
            // Fallback for demo ABHA
            if (abhaNumber === '1234567890' || abhaNumber === '123456789012') {
                return res.json({
                    success: true,
                    patient: {
                        abhaNumber,
                        name: abhaNumber === '1234567890' ? 'Demo Patient' : 'Patient-9012'
                    }
                });
            }
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        res.json({ success: true, patient: { abhaNumber: patient.abhaNumber, name: patient.name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
