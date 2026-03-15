const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: String,
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerName: String,
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  sellerName: String,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledAt: { type: Date, required: true },
  duration: Number, // in minutes
  zoomMeetingId: { type: String, index: true }, // Zoom's numeric meeting ID (stored as string)
  status: { type: String, default: 'scheduled' }, // scheduled, ongoing, completed, cancelled
  dealStatus: { 
    type: String, 
    enum: ['open', 'in-discussion', 'negotiation', 'deal-closed', 'deal-dropped'],
    default: 'open'
  },
  meetingLink: String,
  notes: [{
    authorId: String,
    authorName: String,
    content: String,
    isInternal: Boolean,
    createdAt: Date,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
