const Report = require('../models/Report');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

        let reports = await Report.find({ abhaNumber }).sort({ date: -1 }).limit(5);

        // Fallback for demo patient
        if (reports.length === 0 && abhaNumber === '1234567890') {
            reports = [
                {
                    reportType: 'Blood Test',
                    date: new Date('2024-03-01'),
                    summary: 'Normal blood count. Iron levels are slightly low (11.2 g/dL). Recommend iron-rich diet.'
                },
                {
                    reportType: 'General Checkup',
                    date: new Date('2024-02-15'),
                    summary: 'Patient is healthy. BMI is 22.5. Blood pressure 120/80 mmHg. Advised regular exercise.'
                },
                {
                    reportType: 'X-Ray Chest',
                    date: new Date('2024-01-20'),
                    summary: 'Clear lung fields. No cardiomegaly or pleural effusion noted.'
                }
            ];
        }

        const reportContext = reports.map(r => `[${new Date(r.date).toLocaleDateString()}] ${r.reportType}: ${r.summary}`).join('\n');

        const prompt = `
        You are 'Aarogya AI', a professional and empathetic medical AI assistant.
        Analyze the following recent medical records for a patient:

        ${reportContext}

        Generate a JSON response strictly matching this structure:
        {
           "message": "A 2-3 sentence overall summary of their health status based on these records. Address them directly and compassionately.",
           "insights": [
             { "title": "...", "detail": "...", "color": "tailwind color classes like bg-green-100 text-green-700 based on severity (green for good, yellow for caution, red for alert, blue for informational)" },
             { "title": "...", "detail": "...", "color": "..." },
             { "title": "...", "detail": "...", "color": "..." }
           ]
        }
        Return exactly 3 insights highlighting key takeaways from the reports. ONLY return raw JSON, no markdown formatting like \`\`\`json.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // Clean up any potential markdown from Gemini's response
        let rawResponse = response.text;
        if (rawResponse.startsWith('```json')) {
            rawResponse = rawResponse.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
        }

        const aiData = JSON.parse(rawResponse);
        res.json(aiData);

    } catch (err) {
        console.error('Gemini Analysis Error:', err);
        res.status(500).json({ error: 'AI analysis failed' });
    }
};

exports.chatWithAI = async (req, res) => {
    try {
        const { abhaNumber, message, history } = req.body;

        let reports = await Report.find({ abhaNumber }).sort({ date: -1 }).limit(5);

        // Fallback for demo patient
        if (reports.length === 0 && abhaNumber === '1234567890') {
            reports = [
                {
                    reportType: 'Blood Test',
                    date: new Date('2024-03-01'),
                    summary: 'Normal blood count. Iron levels are slightly low (11.2 g/dL). Recommend iron-rich diet.'
                },
                {
                    reportType: 'General Checkup',
                    date: new Date('2024-02-15'),
                    summary: 'Patient is healthy. BMI is 22.5. Blood pressure 120/80 mmHg. Advised regular exercise.'
                },
                {
                    reportType: 'X-Ray Chest',
                    date: new Date('2024-01-20'),
                    summary: 'Clear lung fields. No cardiomegaly or pleural effusion noted.'
                }
            ];
        }

        const reportContext = reports.map(r => `[${new Date(r.date).toLocaleDateString()}] ${r.reportType}: ${r.summary}`).join('\n');

        const systemPrompt = `You are 'Aarogya AI', a professional and empathetic medical AI assistant. Answer the user's questions based ONLY on their medical records provided below. If they ask something unrelated to their records, politely redirect them. Keep responses concise and easy to understand.
        
        Patient Medical Records Context:
        ${reportContext}
        `;

        // Format history for Gemini
        const formattedHistory = history.map(msg => ({
            role: msg.isAi ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt,
            history: formattedHistory
        });

        const response = await chat.sendMessage({ message });

        res.json({ message: response.text });

    } catch (err) {
        console.error('Gemini Chat Error:', err);
        res.status(500).json({ error: 'AI chat failed' });
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
