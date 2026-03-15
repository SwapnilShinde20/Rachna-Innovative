const User = require('../models/User');
const Seller = require('../models/Seller');
const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const Meeting = require('../models/Meeting');
const TimelineEntry = require('../models/TimelineEntry');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await Seller.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    // Calculate total revenue
    const transactions = await Transaction.find({ status: 'completed' });
    const totalRevenue = transactions.reduce((acc, txn) => acc + txn.amount, 0);

    res.json({
      totalUsers,
      totalSellers,
      totalProperties,
      totalTransactions,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.status = req.body.status || user.status;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Moderate a review (update status, flag, etc.)
// @route   PUT /api/admin/reviews/:id/moderate
// @access  Private (Admin)
const moderateReview = async (req, res) => {
  try {
    // Need to import Review at the top if not already, but wait, Review is already imported? Let's check line 1.
    // Yes, 'const Review = require('../models/Review')' is at line 2 or 1.
    const review = await require('../models/Review').findById(req.params.id);
    if (review) {
      if (req.body.status) review.status = req.body.status;
      if (req.body.flagged !== undefined) review.flagged = req.body.flagged;
      if (req.body.flagReason !== undefined) review.flagReason = req.body.flagReason;
      
      review.moderatedAt = Date.now();
      review.moderatedBy = req.user.id;

      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all completed meetings (video calls)
// @route   GET /api/admin/meetings/completed
// @access  Private (Admin)
const getCompletedMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ status: 'completed' })
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email companyName')
      .populate('propertyId', 'propertyId title')
      .sort({ scheduledAt: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update deal status of a meeting
// @route   PUT /api/admin/meetings/:id/deal-status
// @access  Private (Admin)
const updateMeetingDealStatus = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    
    meeting.dealStatus = req.body.dealStatus;
    const updatedMeeting = await meeting.save();
    res.json(updatedMeeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get timeline entries for a meeting
// @route   GET /api/admin/meetings/:id/timeline
// @access  Private (Admin)
const getTimelineEntries = async (req, res) => {
  try {
    const entries = await TimelineEntry.find({ meetingId: req.params.id })
      .sort({ dateTime: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a timeline entry
// @route   POST /api/admin/meetings/:id/timeline
// @access  Private (Admin)
const addTimelineEntry = async (req, res) => {
  try {
    const { activityType, notes, dateTime, nextActionDate, attachments } = req.body;
    
    const entry = new TimelineEntry({
      meetingId: req.params.id,
      activityType,
      notes,
      dateTime,
      nextActionDate,
      attachments,
      createdBy: req.user ? req.user.name || 'Admin User' : 'Admin User'
    });
    
    const createdEntry = await entry.save();
    res.status(201).json(createdEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update a timeline entry
// @route   PUT /api/admin/meetings/timeline/:entryId
// @access  Private (Admin)
const updateTimelineEntry = async (req, res) => {
  try {
    const entry = await TimelineEntry.findById(req.params.entryId);
    
    if (!entry) {
      return res.status(404).json({ message: 'Timeline entry not found' });
    }
    
    entry.activityType = req.body.activityType || entry.activityType;
    entry.notes = req.body.notes || entry.notes;
    entry.dateTime = req.body.dateTime || entry.dateTime;
    entry.nextActionDate = req.body.nextActionDate !== undefined ? req.body.nextActionDate : entry.nextActionDate;
    entry.attachments = req.body.attachments || entry.attachments;
    
    const updatedEntry = await entry.save();
    res.json(updatedEntry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a timeline entry
// @route   DELETE /api/admin/meetings/timeline/:entryId
// @access  Private (Admin)
const deleteTimelineEntry = async (req, res) => {
  try {
    const entry = await TimelineEntry.findById(req.params.entryId);
    
    if (!entry) {
      return res.status(404).json({ message: 'Timeline entry not found' });
    }
    
    await entry.deleteOne();
    res.json({ message: 'Timeline entry removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a specific meeting
// @route   GET /api/admin/meetings/:id
// @access  Private (Admin)
const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email companyName')
      .populate('propertyId', 'propertyId title');
      
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a note to a meeting
// @route   POST /api/admin/meetings/:id/notes
// @access  Private (Admin)
const addMeetingNote = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const newNote = {
      authorId: req.user.id,
      authorName: req.user.name || 'Admin User',
      content: req.body.content,
      isInternal: true,
      createdAt: new Date(),
    };

    meeting.notes.push(newNote);
    const updatedMeeting = await meeting.save();
    
    res.status(201).json(updatedMeeting.notes[updatedMeeting.notes.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  moderateReview,
  getCompletedMeetings,
  getMeetingById,
  updateMeetingDealStatus,
  getTimelineEntries,
  addTimelineEntry,
  updateTimelineEntry,
  deleteTimelineEntry,
  addMeetingNote,
};
