const mongoose = require('mongoose');

const timelineEntrySchema = new mongoose.Schema({
  meetingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Meeting', 
    required: true 
  },
  activityType: {
    type: String,
    enum: ['phone-call', 'site-visit', 'negotiation', 'document-shared', 'price-discussion', 'deal-progress', 'follow-up', 'email', 'other'],
    required: true
  },
  notes: { 
    type: String, 
    required: true 
  },
  dateTime: { 
    type: Date, 
    required: true 
  },
  nextActionDate: { 
    type: Date 
  },
  attachments: [{
    id: String,
    name: String,
    type: { type: String },
    url: String,
    size: Number
  }],
  createdBy: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('TimelineEntry', timelineEntrySchema);
