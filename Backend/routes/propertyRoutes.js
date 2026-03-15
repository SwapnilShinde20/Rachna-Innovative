const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getPropertyReviews,
  addPropertyReview,
  enquireProperty,
  getPropertyTourStatus,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

// Admin routes (must be before /:id)
router.get('/pending', protect, getPendingProperties);
router.put('/:id/approve', protect, approveProperty);
router.put('/:id/reject', protect, rejectProperty);

// Buyer sub-routes
router.get('/:id/reviews', getPropertyReviews);
router.post('/:id/reviews', protect, addPropertyReview);
router.get('/:id/tour-status', protect, getPropertyTourStatus);
router.post('/:id/enquire', protect, enquireProperty);

router.route('/').get(getProperties).post(protect, createProperty);
router
  .route('/:id')
  .get(getProperty)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

module.exports = router;
