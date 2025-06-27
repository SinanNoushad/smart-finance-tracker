const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      return next(); // proceed to next middleware or controller
    } catch (error) {
      console.error('JWT decode error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 2. If no token is found
  return res.status(401).json({ message: 'Not authorized, no token' });
});
