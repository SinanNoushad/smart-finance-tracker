const express = require('express');
const router = express.Router();
const { getMonthlyReportPdf } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/pdf', getMonthlyReportPdf);

module.exports = router;
