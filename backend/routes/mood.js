const router  = require('express').Router();
const auth    = require('../middleware/auth');
const MoodLog = require('../models/MoodLog');

router.post('/', auth, async (req, res) => {
  try {
    const { mood, note } = req.body;
    const validMoods = ['happy', 'sad', 'anxious', 'angry', 'neutral'];
    if (!mood || !validMoods.includes(mood)) {
      return res.status(400).json({ msg: 'Valid mood required: happy, sad, anxious, angry, neutral' });
    }
    if (note && typeof note !== 'string') {
      return res.status(400).json({ msg: 'Note must be a string' });
    }
    const log = await MoodLog.create({ user: req.user.id, mood, note: note || '' });
    res.status(201).json(log);
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const logs = await MoodLog.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(30);
    res.json(logs);
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ msg: 'Server error' });
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
    if (!res.headersSent) res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/streak', auth, async (req, res) => {
  try {
    const logs = await MoodLog.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('createdAt');

    if (logs.length === 0) {
      return res.json({ currentStreak: 0, longestStreak: 0, totalEntries: 0, todayLogged: false });
    }

    const totalEntries = logs.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLogged = logs.some(log => {
      const logDate = new Date(log.createdAt);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });

    const uniqueDays = [...new Set(
      logs.map(log => {
        const d = new Date(log.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    )].sort((a, b) => b - a);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < uniqueDays.length; i++) {
      if (i === 0) {
        currentStreak = 1;
        continue;
      }
      const diff = (uniqueDays[i - 1] - uniqueDays[i]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    if (!todayLogged && uniqueDays.length > 0) {
      const lastDay = uniqueDays[0];
      const diffFromToday = (today.getTime() - lastDay) / (1000 * 60 * 60 * 24);
      if (diffFromToday > 1) currentStreak = 0;
    }

    res.json({ currentStreak, longestStreak, totalEntries, todayLogged });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
