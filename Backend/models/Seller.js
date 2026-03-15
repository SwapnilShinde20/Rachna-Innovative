const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
  },
  logoUrl: String,
  contactName: String,
  phone: String,
  email: String,
  address: String,
  gstNumber: String,
  licenseNumber: String,
  yearsExperience: Number,
  documents: [
    {
      name: String,
      type: { type: String },
      url: String,
      uploadedAt: Date,
    },
  ],
  status: {
    type: String, // submitted, approved, rejected, under_review
    default: 'submitted',
  },
  verificationRemarks: [
    {
      step: String,
      remark: String,
      status: String,
      reviewedAt: Date,
      reviewedBy: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
