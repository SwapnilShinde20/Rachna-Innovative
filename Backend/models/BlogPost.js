const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: String,
  excerpt: String,
  featuredImage: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: String,
  status: { type: String, default: 'draft' }, // published, draft, pending_approval
  category: String,
  tags: [String],
  seoTitle: String,
  seoDescription: String,
  isFeatured: { type: Boolean, default: false },
  publishedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
