const router = require('express').Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Clinic = require('../models/Clinic');
const User = require('../models/User');
const { sendBookingConfirmation, sendBookingCancellation } = require('../utils/email');

router.post('/', auth, async (req, res) => {
  try {
    const { clinicId, date, time, reason, phone, email } = req.body;

    if (!clinicId) return res.status(400).json({ msg: 'Clinic required' });
    if (!date) return res.status(400).json({ msg: 'Date required' });
    if (!time) return res.status(400).json({ msg: 'Time required' });
    if (!phone || typeof phone !== 'string') return res.status(400).json({ msg: 'Phone required' });
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ msg: 'Valid email required' });
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) return res.status(404).json({ msg: 'Clinic not found' });

    const bookingDate = new Date(date);
    if (bookingDate < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ msg: 'Cannot book for past dates' });
    }

    const existingBooking = await Booking.findOne({
      clinic: clinicId,
      date: bookingDate,
      time,
      status: { $ne: 'cancelled' }
    });
    if (existingBooking) {
      return res.status(400).json({ msg: 'This time slot is already booked' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      clinic: clinicId,
      date: bookingDate,
      time,
      reason: reason || '',
      phone,
      email,
      status: 'pending'
    });

    const populated = await booking.populate('clinic', 'name city phone type');

    const user = await User.findById(req.user.id);
    sendBookingConfirmation({
      to: email,
      userName: user ? user.name : 'User',
      clinicName: clinic.name,
      city: clinic.city,
      date: bookingDate,
      time,
      reason: reason || ''
    }).then(() => console.log('Booking email sent to:', email))
      .catch(err => console.error('Booking email failed:', err.message));

    res.status(201).json(populated);
  } catch (err) {
    console.error('Booking error:', err);
    if (!res.headersSent) res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('clinic', 'name city phone type')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, status: 'pending' },
      { status: 'cancelled' },
      { new: true }
    ).populate('clinic', 'name city');
    if (!booking) return res.status(404).json({ msg: 'Booking not found or cannot be cancelled' });

    if (booking.email && booking.clinic) {
      sendBookingCancellation({
        to: booking.email,
        userName: 'User',
        clinicName: booking.clinic.name,
        date: booking.date,
        time: booking.time
      }).catch(err => console.error('Email send failed:', err.message));
    }

    res.json({ msg: 'Booking cancelled', booking });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
