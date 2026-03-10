const Report = require('../models/Report');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const uploadToPinata = async (filePath, fileName) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    data.append('file', fs.createReadStream(filePath));

    const metadata = JSON.stringify({
        name: fileName,
    });
    data.append('pinataMetadata', metadata);

    const response = await axios.post(url, data, {
        maxBodyLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
        }
    });

    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
};

exports.uploadReport = async (req, res) => {
    try {
        const { abhaNumber, patientName, reportType, doctorName } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ error: 'No report file uploaded' });

        // MOCK: Skip Pinata/DB and return a success response
        const mockReport = {
            _id: 'mock_' + Date.now(),
            abhaNumber,
            patientName,
            reportType,
            doctorName,
            ipfsUrl: 'https://gateway.pinata.cloud/ipfs/mock_hash',
            summary: `MOCK: Analyzed ${reportType} for ${patientName} on ${new Date().toLocaleDateString()}`,
            date: new Date()
        };

        if (file) fs.unlinkSync(file.path);
        res.status(201).json(mockReport);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload report (MOCK)' });
    }
};

exports.analyzeHealth = async (req, res) => {
    try {
        // MOCK: Return static insights
        const insights = [
            { title: "Report Summary", detail: "MOCK: Analyzed 2 recent records.", color: "bg-green-100 text-green-700" },
            { title: "Primary Type", detail: "Blood Test", color: "bg-blue-100 text-blue-700" },
            { title: "Vitals Check", detail: "MOCK: Blood parameters appear stable.", color: "bg-yellow-100 text-yellow-700" }
        ];

        res.json({
            message: "MOCK AI ANALYSIS: I've analyzed your recent reports. Here are some insights:",
            insights
        });
    } catch (err) {
        res.status(500).json({ error: 'AI analysis failed (MOCK)' });
    }
};

exports.getReportsByAbha = async (req, res) => {
    try {
        // MOCK: Return static data for demo ABHA
        if (req.params.abha === '1234567890') {
            return res.json([
                {
                    _id: 'mock1',
                    abhaNumber: '1234567890',
                    patientName: 'Demo Patient',
                    reportType: 'Blood Test',
                    doctorName: 'Dr. Aris',
                    ipfsUrl: 'https://gateway.pinata.cloud/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
                    date: new Date('2024-03-01'),
                    summary: 'MOCK: Normal blood count. Iron levels are slightly low.'
                },
                {
                    _id: 'mock2',
                    abhaNumber: '1234567890',
                    patientName: 'Demo Patient',
                    reportType: 'General Checkup',
                    doctorName: 'Dr. Gupta',
                    ipfsUrl: 'https://gateway.pinata.cloud/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
                    date: new Date('2024-02-15'),
                    summary: 'MOCK: Patient is healthy. Advised regular exercise.'
                }
            ]);
        }
        res.json([]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reports (MOCK)' });
    }
};
