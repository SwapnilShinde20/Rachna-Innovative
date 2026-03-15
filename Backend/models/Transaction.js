const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerName: String,
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  sellerName: String,
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending, completed, failed, refunded
  description: String,
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' }, // Link to a specific video call scheduling
  propertyTitle: String, // Explicitly state which property
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
