const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Report = require('./models/Report');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aarogyachain');

        // Clear existing data
        await User.deleteMany({});
        await Report.deleteMany({});
        await Doctor.deleteMany({});

        // Create Demo Doctor
        const salt = await bcrypt.genSalt(10);
        const hashedDoctorPassword = await bcrypt.hash('doctor123', salt);
        await Doctor.create({
            fullName: 'Dr. Demo',
            uid: 'D-948573',
            email: 'dr.demo@example.com',
            password: hashedDoctorPassword
        });

        // Create Demo Patient
        const demoPatient = await User.create({
            abhaNumber: '1234567890',
            name: 'Demo Patient',
            role: 'Patient'
        });

        // Create Demo Reports
        await Report.create([
            {
                abhaNumber: '1234567890',
                patientName: 'Demo Patient',
                reportType: 'Blood Test',
                doctorName: 'Dr. Aris',
                ipfsUrl: 'https://gateway.pinata.cloud/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco', // Sample PDF CID
                date: new Date('2024-03-01'),
                summary: 'Normal blood count. Iron levels are slightly low.'
            },
            {
                abhaNumber: '1234567890',
                patientName: 'Demo Patient',
                reportType: 'General Checkup',
                doctorName: 'Dr. Gupta',
                ipfsUrl: 'https://gateway.pinata.cloud/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
                date: new Date('2024-02-15'),
                summary: 'Patient is healthy. Advised regular exercise.'
            }
        ]);

        console.log('Demo data seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
