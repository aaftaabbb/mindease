const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    role:      { type: String, enum: ['user','assistant'] },
    content:   String,
    isCrisis:  { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
