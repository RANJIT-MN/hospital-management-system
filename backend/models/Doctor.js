const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  firstName:     { type: String, required: true },
  lastName:      { type: String, required: true },
  specialty:     String,
  qualification: String,
  phone:         String,
  email:         { type: String, unique: true },
  department:    String,
  status:        { type: String, default: 'On Duty' }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);