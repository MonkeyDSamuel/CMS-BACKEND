const mongoose = require('mongoose');

// Consultation Counter Schema
const ConsultationCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Consultation Schema
const ConsultationSchema = new mongoose.Schema({
  Consultation_Id: { type: String, unique: true, required: false },
  Appointment_Id: { type: String, required: true, ref: 'Appointment' },
  Doctor_Id: { type: String, required: true, ref: 'Doctor' },
  Notes: { type: String }
});

// Pre-save middleware for Consultation_Id
ConsultationSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await ConsultationCounter.findOneAndUpdate(
        { _id: 'Consultation_Id' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.Consultation_Id = `CONSULT${String(counter.seq).padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Medicine Prescription Counter
const MedinePresCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Medicine Prescription Schema
const MedicinePresSchema = new mongoose.Schema({
    Prescription_Id: { type: String, unique: true, required: false },
    Appointment_Id: { type: String, required: true, ref: 'Appointment' },
    Doctor_Id: { type: String, required: true, ref: 'Doctor' },
    medicine_id: [{type: String, required:true, ref:'Medicine'}],
    Notes: { type: String }
});

// Pre-save middleware for Prescription_Id
MedicinePresSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await MedicinePresCounter.findOneAndUpdate(
        { _id: 'Prescription_Id' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.Prescription_Id = `PRESC${String(counter.seq).padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Lab test prescription counter Schema
const LabPresCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Lab test Prescription Schema
const LabPresSchema = new mongoose.Schema({
    LabPrescription_Id: { type: String, unique: true, required: false },
    Appointment_Id: { type: String, required: true, ref: 'Appointment' },
    Doctor_Id: { type: String, required: true, ref: 'Doctor' },
    Labtest_Id: [{type: String, required:true, ref:'LabTest'}],
    Notes: { type: String }
});

// Pre-save middleware for LabPrescription_Id
LabPresSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await LabPresCounter.findOneAndUpdate(
        { _id: 'LabPrescription_Id' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.LabPrescription_Id = `LABPRES${String(counter.seq).padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const ConsultationCounter = mongoose.model('ConsultationCounter', ConsultationCounterSchema);
const Consultation = mongoose.model('Consultation', ConsultationSchema);
const MedicinePresCounter = mongoose.model('MedicinePresCounter', MedinePresCounterSchema);
const MedicinePres = mongoose.model('MedicinePres', MedicinePresSchema);
const LabPresCounter = mongoose.model('LabPresCounter', LabPresCounterSchema);
const LabPres = mongoose.model('LabPres', LabPresSchema);

module.exports = {
  ConsultationCounter,
  Consultation,
  MedicinePresCounter,
  MedicinePres,
  LabPresCounter,
  LabPres
};