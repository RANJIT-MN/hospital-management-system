const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  firstName:        { type: String, required: true },
  lastName:         { type: String, required: true },
  dob:              { type: Date, required: true },
  gender:           { type: String, required: true },
  bloodGroup:       String,
  phone:            { type: String, required: true, unique: true },
  email:            String,
  address:          String,
  emergencyContact: String,
  department:       String,
  assignedDoctor:   { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  symptoms:         String,
  status:           { type: String, default: 'Active' },
  patientId:        { type: String, unique: true }
}, { timestamps: true });

PatientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const count = await mongoose.model('Patient').countDocuments();
    this.patientId = `P-${1000 + count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Patient', PatientSchema);