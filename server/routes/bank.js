const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { connectBank, fetchBankTransactions } = require('../controllers/bankIntegrationController');

const router = express.Router();

router.post('/connect', protect, connectBank);
router.get('/transactions', protect, fetchBankTransactions);

module.exports = router;