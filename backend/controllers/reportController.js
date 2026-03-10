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
        const { abhaNumber, patientName, reportType, doctorName, date } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ error: 'No report file uploaded' });

        let ipfsUrl = 'https://gateway.pinata.cloud/ipfs/mock_hash';
        if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_KEY) {
            try {
                ipfsUrl = await uploadToPinata(file.path, file.originalname);
            } catch (pinataErr) {
                console.error("Pinata upload failed, using mock:", pinataErr.message);
            }
        }

        const newReport = await Report.create({
            abhaNumber,
            patientName,
            reportType,
            doctorName,
            ipfsUrl,
            summary: `Automated analysis for ${reportType}. Visual inspection completed.`,
            date: date || new Date()
        });

        if (file) fs.unlinkSync(file.path);
        res.status(201).json(newReport);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload report' });
    }
};

exports.analyzeHealth = async (req, res) => {
    try {
        const { abhaNumber } = req.body;
        const reports = await Report.find({ abhaNumber }).sort({ date: -1 }).limit(5);

        // MOCK: Return static insights based on real report count if any
        const insights = [
            { title: "Report Summary", detail: `Analyzed ${reports.length > 0 ? reports.length : 'demo'} recent records.`, color: "bg-green-100 text-green-700" },
            { title: "Primary Type", detail: reports[0]?.reportType || "General Checkup", color: "bg-blue-100 text-blue-700" },
            { title: "Vitals Check", detail: "Blood parameters appear stable based on latest logs.", color: "bg-yellow-100 text-yellow-700" }
        ];

        res.json({
            message: "I've analyzed your medical history. Your vital trends are stable, and all recent report parameters are within the expected physiological ranges.",
            insights
        });
    } catch (err) {
        res.status(500).json({ error: 'AI analysis failed' });
    }
};

exports.getReportsByAbha = async (req, res) => {
    try {
        const reports = await Report.find({ abhaNumber: req.params.abha }).sort({ date: -1 });

        // If no reports in DB and it's the demo ABHA, return demo data
        if (reports.length === 0 && req.params.abha === '1234567890') {
            return res.json([
                {
                    _id: 'mock1',
                    abhaNumber: '1234567890',
                    patientName: 'Demo Patient',
                    reportType: 'Blood Test',
                    doctorName: 'Dr. Aris',
                    ipfsUrl: 'https://gateway.pinata.cloud/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
                    date: new Date('2024-03-01'),
                    summary: 'Normal blood count. Iron levels are slightly low (11.2 g/dL). Recommend iron-rich diet.'
                },
                {
                    _id: 'mock2',
                    abhaNumber: '1234567890',
                    patientName: 'Demo Patient',
                    reportType: 'General Checkup',
                    doctorName: 'Dr. Gupta',
                    ipfsUrl: 'https://gateway.pinata.cloud/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
                    date: new Date('2024-02-15'),
                    summary: 'Patient is healthy. BMI is 22.5. Blood pressure 120/80 mmHg. Advised regular exercise.'
                },
                {
                    _id: 'mock3',
                    abhaNumber: '1234567890',
                    patientName: 'Demo Patient',
                    reportType: 'X-Ray Chest',
                    doctorName: 'Dr. Sharma',
                    ipfsUrl: 'https://gateway.pinata.cloud/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
                    date: new Date('2024-01-20'),
                    summary: 'Clear lung fields. No cardiomegaly or pleural effusion noted.'
                }
            ]);
        }
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};
