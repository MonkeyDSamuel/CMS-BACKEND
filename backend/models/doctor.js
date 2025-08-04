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

// Pre-save middleware to validate doctor exists for Consultation
ConsultationSchema.pre('save', async function(next) {
  try {
    // Import Doctor model
    const { Doctor } = require('./admin');
    
    // Check if doctor exists
    const doctor = await Doctor.findOne({ Doctor_Id: this.Doctor_Id, isActive: true });
    if (!doctor) {
      return next(new Error(`Doctor with ID '${this.Doctor_Id}' does not exist or is inactive`));
    }
    next();
  } catch (error) {
    return next(error);
  }
});

// Pre-save middleware to validate appointment exists for Consultation
ConsultationSchema.pre('save', async function(next) {
  try {
    // Import Appointment model
    const { Appointment } = require('./receptionist');
    
    // Check if appointment exists
    const appointment = await Appointment.findOne({ App_Id: this.Appointment_Id });
    if (!appointment) {
      return next(new Error(`Appointment with ID '${this.Appointment_Id}' does not exist`));
    }
    next();
  } catch (error) {
    return next(error);
  }
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
    Notes: { type: String },
    // Dispensing/result fields (for pharmacist)
    dispensed_by: { type: String, ref: 'Staff' }, // pharmacist Staff_Id
    dispensed_at: { type: Date },
    dispense_notes: { type: String },
    status: { type: String, enum: ['pending', 'dispensed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
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

// Pre-save middleware to validate doctor exists for MedicinePres
MedicinePresSchema.pre('save', async function(next) {
  try {
    // Import Doctor model
    const { Doctor } = require('./admin');
    
    // Check if doctor exists
    const doctor = await Doctor.findOne({ Doctor_Id: this.Doctor_Id, isActive: true });
    if (!doctor) {
      return next(new Error(`Doctor with ID '${this.Doctor_Id}' does not exist or is inactive`));
    }
    next();
  } catch (error) {
    return next(error);
  }
});

// Pre-save middleware to validate appointment exists for MedicinePres
MedicinePresSchema.pre('save', async function(next) {
  try {
    // Import Appointment model
    const { Appointment } = require('./receptionist');
    
    // Check if appointment exists
    const appointment = await Appointment.findOne({ App_Id: this.Appointment_Id });
    if (!appointment) {
      return next(new Error(`Appointment with ID '${this.Appointment_Id}' does not exist`));
    }
    next();
  } catch (error) {
    return next(error);
  }
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
    Notes: { type: String },
    // Result fields (for lab technician)
    result_notes: String,
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    date_tested: Date,
    min_reading: Number,
    max_reading: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
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

// Pre-save middleware to validate doctor exists for LabPres
LabPresSchema.pre('save', async function(next) {
  try {
    // Import Doctor model
    const { Doctor } = require('./admin');
    
    // Check if doctor exists
    const doctor = await Doctor.findOne({ Doctor_Id: this.Doctor_Id, isActive: true });
    if (!doctor) {
      return next(new Error(`Doctor with ID '${this.Doctor_Id}' does not exist or is inactive`));
    }
    next();
  } catch (error) {
    return next(error);
  }
});

// Pre-save middleware to validate appointment exists for LabPres
LabPresSchema.pre('save', async function(next) {
  try {
    // Import Appointment model
    const { Appointment } = require('./receptionist');
    
    // Check if appointment exists
    const appointment = await Appointment.findOne({ App_Id: this.Appointment_Id });
    if (!appointment) {
      return next(new Error(`Appointment with ID '${this.Appointment_Id}' does not exist`));
    }
    next();
  } catch (error) {
    return next(error);
  }
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