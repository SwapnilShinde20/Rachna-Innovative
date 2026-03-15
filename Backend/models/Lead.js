const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  propertyName: {
    type: String,
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  buyerAvatar: {
    type: String,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new',
  },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
