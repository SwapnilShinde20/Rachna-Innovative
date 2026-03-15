const mongoose = require('mongoose');

const cmsPageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: String,
  seoTitle: String,
  seoDescription: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  section: String, // home, about, policies
  order: Number,
}, { timestamps: true });

module.exports = mongoose.model('CMSPage', cmsPageSchema);
