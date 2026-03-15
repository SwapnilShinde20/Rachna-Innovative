const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  moderateReview,
  getCompletedMeetings,
  updateMeetingDealStatus,
  getTimelineEntries,
  addTimelineEntry,
  updateTimelineEntry,
  deleteTimelineEntry,
  addMeetingNote
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Middleware to check admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id', protect, admin, updateUserStatus);
router.put('/reviews/:id/moderate', protect, admin, moderateReview);

// Meeting & Timeline routes
router.get('/meetings/completed', protect, admin, getCompletedMeetings);
router.get('/meetings/:id', protect, admin, require('../controllers/adminController').getMeetingById);
router.put('/meetings/:id/deal-status', protect, admin, updateMeetingDealStatus);
router.get('/meetings/:id/timeline', protect, admin, getTimelineEntries);
router.post('/meetings/:id/timeline', protect, admin, addTimelineEntry);
router.put('/meetings/timeline/:entryId', protect, admin, updateTimelineEntry);
router.delete('/meetings/timeline/:entryId', protect, admin, deleteTimelineEntry);
router.post('/meetings/:id/notes', protect, admin, addMeetingNote);

// Admin manual meeting status override (fallback if webhook fails)
router.patch('/meetings/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['scheduled', 'ongoing', 'completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed: ${allowed.join(', ')}` });
    }
    const Meeting = require('../models/Meeting');
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    console.log(`Admin manually updated meeting ${meeting._id} status to "${status}"`);
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
