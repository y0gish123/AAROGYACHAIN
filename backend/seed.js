const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Report = require('./models/Report');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aarogyachain');

        // Clear existing data
        await User.deleteMany({});
        await Report.deleteMany({});

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
