const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient:    { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor:     { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor',  required: true },
  department: String,
  date:       { type: Date, required: true },
  timeSlot:   { type: String, required: true },
  type:       { type: String, default: 'Consultation' },
  notes:      String,
  status:     { type: String, default: 'Scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);