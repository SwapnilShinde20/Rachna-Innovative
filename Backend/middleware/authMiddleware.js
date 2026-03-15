const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in cookies first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = { protect };
