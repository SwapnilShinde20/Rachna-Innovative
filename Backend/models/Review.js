const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerName: String,
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  sellerName: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  status: { type: String, default: 'approved' }, // approved, pending, rejected
  flagged: { type: Boolean, default: false },
  flagReason: String,
  moderatedAt: Date,
  moderatedBy: String,
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
