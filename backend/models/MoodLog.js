const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood:  { type: String, enum: ['happy','sad','anxious','angry','neutral'], required: true },
  note:  { type: String, default: '' },
  date:  { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MoodLog', MoodSchema);
