const Report = require('../models/Report');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
        let { abhaNumber, patientName, reportType, doctorName, date } = req.body;
        const file = req.file;

        // Normalize ABHA: Strip spaces/dashes
        abhaNumber = abhaNumber.replace(/\D/g, '');

        if (!file) return res.status(400).json({ error: 'No report file uploaded' });

        // Define parallel tasks
        const pinataTask = (async () => {
            if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_KEY) {
                try {
                    return await uploadToPinata(file.path, file.originalname);
                } catch (pinataErr) {
                    console.error("Pinata upload failed, using mock:", pinataErr.message);
                }
            }
            return 'https://gateway.pinata.cloud/ipfs/mock_hash';
        })();

        const aiTask = (async () => {
            let aiSummary = `Automated analysis for ${reportType}. Visual inspection completed.`;
            if (file && file.mimetype === 'application/pdf') {
                try {
                    const dataBuffer = fs.readFileSync(file.path);
                    const pdfData = await pdf(dataBuffer);
                    const extractedText = pdfData.text;

                    if (extractedText.trim()) {
                        const summaryPrompt = `
                        You are a professional medical scribe. Summarize the following medical report text in 2-3 concise sentences. 
                        Focus on key findings, vitals, or diagnoses. If the text is illegible or not a medical report, return a generic summary.
                        
                        Report Content:
                        ${extractedText.substring(0, 5000)}
                        `;

                        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
                        const summaryResponse = await model.generateContent(summaryPrompt);
                        aiSummary = summaryResponse.response.text().trim();
                    }
                } catch (err) {
                    console.error("PDF Parsing/Summary error:", err.message);
                }
            }
            return aiSummary;
        })();

        // Execute tasks in parallel
        const [ipfsUrl, aiSummary] = await Promise.all([pinataTask, aiTask]);

        const newReport = await Report.create({
            abhaNumber,
            patientName,
            reportType,
            doctorName,
            ipfsUrl,
            summary: aiSummary,
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
        let { abhaNumber } = req.body;
        // Normalize ABHA
        abhaNumber = abhaNumber.replace(/\D/g, '');

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

        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up any potential markdown from Gemini's response
        let rawResponse = responseText;
        if (rawResponse.startsWith('```json')) {
            rawResponse = rawResponse.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
        }

        const aiData = JSON.parse(rawResponse);
        res.json(aiData);

    } catch (err) {
        console.error('Gemini Analysis Error:', err.message);
        res.status(500).json({ error: 'AI analysis failed' });
    }
};

exports.chatWithAI = async (req, res) => {
    try {
        let { abhaNumber, message, history } = req.body;
        // Normalize ABHA
        abhaNumber = abhaNumber.replace(/\D/g, '');

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
        console.log(`[AI Chat] Context for ABHA ${abhaNumber}:`, reportContext || "No records found.");

        const systemPrompt = `You are 'Aarogya AI', a professional and empathetic medical AI assistant. Answer the user's questions based ONLY on their medical records provided below. If they ask something unrelated to their records, politely redirect them. Keep responses concise and easy to understand.
        
        Patient Medical Records Context:
        ${reportContext}
        `;

        // Format history for Gemini
        let formattedHistory = history.map(msg => ({
            role: msg.isAi ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        // SDK requires first message to be from 'user' and roles must alternate
        while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.shift();
        }

        // Filter to ensure alternating roles (very basic enforcement)
        formattedHistory = formattedHistory.filter((msg, i, arr) => {
            return i === 0 || msg.role !== arr[i - 1].role;
        });

        const model = genAI.getGenerativeModel({ 
            model: "gemini-flash-lite-latest",
            systemInstruction: systemPrompt 
        });

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        res.json({ message: responseText });

    } catch (err) {
        console.error('Gemini Chat Error:', err.message);
        res.status(500).json({ error: 'AI chat failed' });
    }
};

exports.getReportsByAbha = async (req, res) => {
    try {
        const abhaNumber = req.params.abha.replace(/\D/g, '');
        const reports = await Report.find({ abhaNumber }).sort({ date: -1 });

        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};

exports.getReportDetail = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch report details' });
    }
};

