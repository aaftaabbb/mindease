const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clinic:  { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  date:    { type: Date, required: true },
  time:    { type: String, required: true },
  reason:  { type: String, maxlength: 500, default: '' },
  status:  { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  phone:   { type: String, required: true },
  notes:   { type: String, maxlength: 500, default: '' },
}, { timestamps: true });

BookingSchema.index({ user: 1, date: -1 });
BookingSchema.index({ clinic: 1, date: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
