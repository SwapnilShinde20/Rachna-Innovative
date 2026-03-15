const express = require('express');
const router = express.Router();
const {
  getSellers,
  getSeller,
  updateSellerProfile,
  updateSellerStatus,
  getSellerMe,
  getSellerLeads,
  getSellerAnalytics,
  getSellerFullAnalytics
} = require('../controllers/sellerController');
const { protect } = require('../middleware/authMiddleware');

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

router.route('/').get(protect, getSellers).post(protect, updateSellerProfile);
router.route('/me').get(protect, getSellerMe);
router.route('/me/leads').get(protect, getSellerLeads);
router.route('/me/analytics').get(protect, getSellerAnalytics);
router.route('/me/analytics/full').get(protect, getSellerFullAnalytics);
router.put('/:id/status', protect, admin, updateSellerStatus);
router.route('/:id').get(protect, getSeller);

module.exports = router;

