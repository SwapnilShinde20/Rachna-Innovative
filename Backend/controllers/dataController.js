const Seller = require('../models/Seller');
const Review = require('../models/Review');
const Transaction = require('../models/Transaction');
const Meeting = require('../models/Meeting');
const BlogPost = require('../models/BlogPost');
const CMSPage = require('../models/CMSPage');
const Notification = require('../models/Notification');
const zoomService = require('../services/zoomService');

// ==================== REVIEWS ====================
const getReviews = async (req, res) => {
  try { res.json(await Review.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
const createReview = async (req, res) => {
  try { res.status(201).json(await Review.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
};
const updateReview = async (req, res) => {
  try { res.json(await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(400).json({ message: err.message }); }
};
const deleteReview = async (req, res) => {
  try { await Review.findByIdAndDelete(req.params.id); res.json({ message: 'Review deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// ==================== TRANSACTIONS ====================
const getTransactions = async (req, res) => {
  try { res.json(await Transaction.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
const createTransaction = async (req, res) => {
  try { res.status(201).json(await Transaction.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
};
const updateTransaction = async (req, res) => {
  try { 
    const originalTransaction = await Transaction.findById(req.params.id);
    if (!originalTransaction) return res.status(404).json({ message: 'Transaction not found' });

    const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true }); 

    // If transaction is newly completed, notify participants
    if (originalTransaction.status !== 'completed' && req.body.status === 'completed') {
      // Notify Seller
      await Notification.create({
        userId: updatedTransaction.sellerId.toString(),
        title: 'Payment Successful',
        message: `Payment for video tour "${updatedTransaction.propertyTitle}" is confirmed. You can now join the call.`,
        type: 'success',
        link: '/dashboard/video-calls'
      });

      // Notify Buyer (if meetingId exists)
      if (updatedTransaction.meetingId) {
        await Notification.create({
          userId: updatedTransaction.buyerId.toString(),
          title: 'Video Tour Ready',
          message: `The booking fee for "${updatedTransaction.propertyTitle}" has been paid. The call is now joinable.`,
          type: 'success',
          link: '/dashboard'
        });
      }
    }

    res.json(updatedTransaction);
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};

// ==================== MEETINGS ====================
const getMeetings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'buyer') {
      query.buyerId = req.user.id;
    } else if (req.user.role === 'seller') {
      const seller = await Seller.findOne({ userId: req.user.id });
      if (seller) {
        query.sellerId = seller._id;
      } else {
        return res.json([]); // No seller profile found
      }
    }
    
    // Auto-update missed tours: Any 'scheduled' tour > 24hrs past
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Meeting.updateMany(
      { ...query, status: 'scheduled', scheduledAt: { $lt: twentyFourHoursAgo } },
      { status: 'missed' }
    );

    // admin sees all meetings
    res.json(await Meeting.find(query).sort({ scheduledAt: -1 }));
  }
  catch (err) { res.status(500).json({ message: err.message }); }
};
const createMeeting = async (req, res) => {
  try {
    let meetingData = { ...req.body };
    
    // If Admin creates a meeting already in scheduled status
    if (meetingData.status === 'scheduled' && !meetingData.meetingLink) {
      try {
        const zoomMeeting = await zoomService.createMeeting(
          meetingData.title,
          meetingData.scheduledAt,
          meetingData.duration || 30
        );
        meetingData.meetingLink = zoomMeeting.join_url;
        meetingData.zoomMeetingId = String(zoomMeeting.id);
      } catch (zoomErr) {
        console.error('Zoom scheduling failed during creation:', zoomErr);
        // We still create the meeting but it will have the random link (or handle as error)
      }
    }

    const meeting = await Meeting.create(meetingData);
    res.status(201).json(meeting);
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};
const updateMeeting = async (req, res) => {
  try { 
    const originalMeeting = await Meeting.findById(req.params.id);
    if (!originalMeeting) return res.status(404).json({ message: 'Meeting not found' });

    let updateData = { ...req.body };

    // If meeting is being scheduled (from requested to scheduled)
    if (originalMeeting.status !== 'scheduled' && req.body.status === 'scheduled') {
      try {
        const scheduledTime = req.body.scheduledAt || originalMeeting.scheduledAt;
        const duration = req.body.duration || originalMeeting.duration || 30;
        
        const zoomMeeting = await zoomService.createMeeting(
          originalMeeting.title,
          scheduledTime,
          duration
        );
        
        updateData.meetingLink = zoomMeeting.join_url;
        updateData.zoomMeetingId = String(zoomMeeting.id);
      } catch (zoomErr) {
        console.error('Zoom scheduling failed during update:', zoomErr);
        // Fallback to existing or placeholder link if needed? 
        // For now, let's let it proceed with random link if Zoom fails, 
        // but log the error. In production, we might want to return 500.
      }
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(req.params.id, updateData, { new: true });

    // If meeting is newly scheduled, generate a transaction (invoice) and notify
    if (originalMeeting.status !== 'scheduled' && updatedMeeting.status === 'scheduled') {
      const existingTransaction = await Transaction.findOne({ meetingId: updatedMeeting._id });
      if (!existingTransaction) {
        await Transaction.create({
          buyerId: updatedMeeting.buyerId,
          buyerName: updatedMeeting.buyerName,
          sellerId: updatedMeeting.sellerId,
          sellerName: updatedMeeting.sellerName,
          amount: 500,
          status: 'pending',
          description: 'Video Tour Booking Fee',
          meetingId: updatedMeeting._id,
          propertyTitle: updatedMeeting.title.replace('Property Tour: ', ''),
        });
      }

      // Notify participants of the scheduled meeting
      await Notification.create({
        userId: updatedMeeting.sellerId.toString(),
        title: 'Video Call Scheduled',
        message: `A video tour for "${updatedMeeting.title}" has been scheduled for ${new Date(updatedMeeting.scheduledAt).toLocaleString()}.`,
        type: 'info',
        link: '/dashboard/video-calls'
      });

      await Notification.create({
        userId: updatedMeeting.buyerId.toString(),
        title: 'Video Call Scheduled',
        message: `Your video tour for "${updatedMeeting.title}" has been scheduled for ${new Date(updatedMeeting.scheduledAt).toLocaleString()}.`,
        type: 'info',
        link: '/dashboard'
      });
    }

    res.json(updatedMeeting); 
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};
const deleteMeeting = async (req, res) => {
  try { await Meeting.findByIdAndDelete(req.params.id); res.json({ message: 'Meeting deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// ==================== BLOG POSTS ====================
const getBlogPosts = async (req, res) => {
  try { res.json(await BlogPost.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
const getBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Blog post not found' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
const createBlogPost = async (req, res) => {
  try { res.status(201).json(await BlogPost.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
};
const updateBlogPost = async (req, res) => {
  try { res.json(await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(400).json({ message: err.message }); }
};
const deleteBlogPost = async (req, res) => {
  try { await BlogPost.findByIdAndDelete(req.params.id); res.json({ message: 'Blog post deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// ==================== CMS PAGES ====================
const getCMSPages = async (req, res) => {
  try { res.json(await CMSPage.find().sort({ order: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
const getCMSPage = async (req, res) => {
  try {
    const page = await CMSPage.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'CMS page not found' });
    res.json(page);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
const createCMSPage = async (req, res) => {
  try { res.status(201).json(await CMSPage.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
};
const updateCMSPage = async (req, res) => {
  try { res.json(await CMSPage.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(400).json({ message: err.message }); }
};
const deleteCMSPage = async (req, res) => {
  try { await CMSPage.findByIdAndDelete(req.params.id); res.json({ message: 'CMS page deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// ==================== NOTIFICATIONS ====================
const getNotifications = async (req, res) => {
  try { res.json(await Notification.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
const updateNotification = async (req, res) => {
  try { res.json(await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(400).json({ message: err.message }); }
};
const deleteNotification = async (req, res) => {
  try { await Notification.findByIdAndDelete(req.params.id); res.json({ message: 'Notification deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
const markAllNotificationsAsRead = async (req, res) => {
  try { 
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
  getReviews, createReview, updateReview, deleteReview,
  getTransactions, createTransaction, updateTransaction,
  getMeetings, createMeeting, updateMeeting, deleteMeeting,
  getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost,
  getCMSPages, getCMSPage, createCMSPage, updateCMSPage, deleteCMSPage,
  getNotifications, updateNotification, deleteNotification, markAllNotificationsAsRead,
};
