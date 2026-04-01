const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect } = require('../middleware/auth');

// Get all patients
router.get('/', protect, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Register new patient
router.post('/', protect, async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json({ message: 'Patient registered!', patient });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Update patient
router.patch('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(patient);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Delete patient
router.delete('/:id', protect, async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;