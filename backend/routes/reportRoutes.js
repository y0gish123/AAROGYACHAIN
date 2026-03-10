const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadReport, getReportsByAbha } = require('../controllers/reportController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('report'), uploadReport);
router.get('/:abha', getReportsByAbha);

module.exports = router;
