const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const appts = await Appointment.find()
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName specialty')
      .sort({ date: 1 });
    res.json(appts);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const appt = await Appointment.create(req.body);
    res.status(201).json({ message: 'Appointment booked!', appt });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.patch('/:id', protect, async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(appt);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;