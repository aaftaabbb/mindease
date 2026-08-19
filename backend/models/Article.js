const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  slug:       { type: String, required: true, unique: true },
  category:   { type: String, enum: ['anxiety', 'depression', 'stress', 'sleep', 'self-care', 'relationships', 'mindfulness', 'general'], required: true },
  excerpt:    { type: String, required: true },
  content:    { type: String, required: true },
  readTime:   { type: Number, default: 3 },
  tags:       [String],
  image:      { type: String, default: '' },
  featured:   { type: Boolean, default: false },
}, { timestamps: true });

ArticleSchema.index({ category: 1 });
ArticleSchema.index({ slug: 1 });

module.exports = mongoose.model('Article', ArticleSchema);
