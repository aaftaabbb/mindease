const router = require('express').Router();
const Clinic = require('../models/Clinic');

router.get('/', async (req, res) => {
  try {
    const clinics = await Clinic.find({ available: true });
    res.json(clinics);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
