const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadReport, getReportsByAbha, analyzeHealth } = require('../controllers/reportController');

const upload = multer({ dest: 'uploads/' });

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.post('/upload', upload.single('report'), uploadReport);
router.post('/analyze', analyzeHealth);
router.get('/:abha', getReportsByAbha);

module.exports = router;
