const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/serviceRequestController');
const { protect } = require('../middleware/authMiddleware');

// Middleware to check admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// User creates a request (needs to be logged in according to current routes config)
router.post('/', protect, createRequest);

// Get requests (Users see their own, Admin sees all - logic handled in controller)
router.get('/', protect, getRequests);

// Admin updates status
router.put('/:id/status', protect, admin, updateRequestStatus);

module.exports = router;
