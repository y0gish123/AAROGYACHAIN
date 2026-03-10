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

        // Upload to Pinata (IPFS)
        const ipfsUrl = await uploadToPinata(file.path, file.originalname);

        // Save to MongoDB
        const report = new Report({
            abhaNumber,
            patientName,
            reportType,
            doctorName,
            ipfsUrl,
            summary: `Analyzed ${reportType} for ${patientName} on ${new Date().toLocaleDateString()}`
        });

        await report.save();

        // Clean up local file
        fs.unlinkSync(file.path);

        res.status(201).json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload report' });
    }
};

exports.getReportsByAbha = async (req, res) => {
    try {
        const reports = await Report.find({ abhaNumber: req.params.abha }).sort({ date: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};
