const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  location: String,
  city: String,
  state: String,
  zip: String,
  price: {
    type: Number,
    required: true,
  },
  deposit: Number,
  availableFrom: Date,
  minLease: String,
  utilitiesIncluded: { type: Boolean, default: false },
  description: String,
  images: [String],
  amenities: [String],
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  parking: Number,
  rating: {
    type: Number,
    default: 0,
  },
  status: {
    type: String, // pending_review, approved, rejected, sold
    default: 'pending_review',
  },
  adminRemarks: String,
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
