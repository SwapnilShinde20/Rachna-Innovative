const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: String },
  title: { type: String, required: true },
  message: { type: String },
  type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  isRead: { type: Boolean, default: false },
  link: String,
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
