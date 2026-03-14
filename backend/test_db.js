const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');

dotenv.config();

const listDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected successfully!");

        const doctors = await Doctor.find({}, 'fullName uid email');
        console.log(`Total doctors: ${doctors.length}`);
        doctors.forEach(d => {
            console.log(`- ${d.fullName} (${d.uid}) [${d.email}]`);
        });

        const target = await Doctor.findOne({ uid: 'D-914253' });
        console.log(`Target D-914253 found: ${!!target}`);
        
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
};

listDoctors();
