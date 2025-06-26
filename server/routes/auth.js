const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/auth/signup
router.post('/signup', registerUser);

// @route POST /api/auth/login
router.post('/login', authUser);

// @route GET /api/auth/profile
router.get('/profile', protect, getUserProfile);

module.exports = router;
