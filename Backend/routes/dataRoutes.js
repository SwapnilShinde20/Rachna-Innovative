const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getReviews, createReview, updateReview, deleteReview,
  getTransactions, createTransaction, updateTransaction,
  getMeetings, createMeeting, updateMeeting, deleteMeeting,
  getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost,
  getCMSPages, getCMSPage, createCMSPage, updateCMSPage, deleteCMSPage,
  getNotifications, updateNotification, deleteNotification, markAllNotificationsAsRead,
} = require('../controllers/dataController');

// Reviews
router.route('/reviews').get(protect, getReviews).post(protect, createReview);
router.route('/reviews/:id').put(protect, updateReview).delete(protect, deleteReview);

// Transactions
router.route('/transactions').get(protect, getTransactions).post(protect, createTransaction);
router.route('/transactions/:id').put(protect, updateTransaction);

// Meetings
router.route('/meetings').get(protect, getMeetings).post(protect, createMeeting);
router.route('/meetings/:id').put(protect, updateMeeting).delete(protect, deleteMeeting);

// Blog Posts
router.route('/blogs').get(protect, getBlogPosts).post(protect, createBlogPost);
router.route('/blogs/:id').get(protect, getBlogPost).put(protect, updateBlogPost).delete(protect, deleteBlogPost);

// CMS Pages
router.route('/cms').get(protect, getCMSPages).post(protect, createCMSPage);
router.route('/cms/:id').get(protect, getCMSPage).put(protect, updateCMSPage).delete(protect, deleteCMSPage);

// Notifications
router.route('/notifications').get(protect, getNotifications);
router.route('/notifications/read-all').post(protect, markAllNotificationsAsRead);
router.route('/notifications/:id').put(protect, updateNotification).delete(protect, deleteNotification);

module.exports = router;
