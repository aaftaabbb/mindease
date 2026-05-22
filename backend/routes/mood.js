const router  = require('express').Router();
const auth    = require('../middleware/auth');
const MoodLog = require('../models/MoodLog');

router.post('/', auth, async (req, res) => {
  try {
    const { mood, note } = req.body;
    const log = await MoodLog.create({ user: req.user.id, mood, note });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const logs = await MoodLog.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(30);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const moods = ['happy','sad','anxious','angry','neutral'];
    const stats = {};
    for (const mood of moods) {
      stats[mood] = await MoodLog.countDocuments({ user: req.user.id, mood });
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
