const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:   { type: String, required: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 2000 },
  mood:    { type: String, enum: ['happy','sad','anxious','angry','neutral'], default: 'neutral' },
  tags:    [{ type: String, maxlength: 30 }],
  reflection: { type: String, default: '' },
}, { timestamps: true });

JournalSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Journal', JournalSchema);
