const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/login', async (req, res) => {
    try {
        const { abhaNumber, otp } = req.body;
        if (!abhaNumber || !otp) return res.status(400).json({ success: false, message: 'ABHA Number and OTP are required' });
        if (!/^\d+$/.test(otp)) return res.status(400).json({ success: false, message: 'OTP must contain only numbers.' });
        if (otp.length !== 6) return res.status(400).json({ success: false, message: 'OTP must be exactly 6 digits.' });

        let patient;
        try {
            if (mongoose.connection.readyState === 1) {
                patient = await User.findOne({ abhaNumber, role: 'Patient' });
            } else {
                throw new Error("Mongoose not connected");
            }
        } catch (dbError) {
            console.log("DB Error during patient login:", dbError.message);
            patient = { _id: "mock-id", abhaNumber, name: `Patient-${abhaNumber.slice(-4)}`, role: 'Patient' };
        }

        return res.json({ success: true, message: 'Patient login successful', patient });
    } catch (error) {
        console.error("Outer Error:", error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});

const server = app.listen(0, async () => {
    try {
        const port = server.address().port;
        const res = await axios.post(`http://localhost:${port}/login`, { abhaNumber: '123456789012', otp: '123456' });
        console.log('Response:', res.data);
    } catch (e) {
        console.error('Axios Error:', e.response ? e.response.data : e.message);
    }
    server.close();
});
