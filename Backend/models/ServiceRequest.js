const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest submissions if needed, though forms are under protected routes.
  },
  serviceCategory: {
    type: String,
    enum: ['Legal', 'Security'],
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  requestType: {
    type: String,
    required: false
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  files: [{
    type: String // URLs or base64 strings of uploaded documents
  }],
  urgency: {
    type: String,
    enum: ['Normal', 'Urgent'],
    default: 'Normal'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
