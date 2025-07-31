const mongoose = require('mongoose');

//Consulatation Counter Schema
const ConsultationCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

//Consulatation Schema
const ConsultationSchema = new mongoose.Schema({
  Consultation_Id: { type: String, unique: true },
  Appointment_Id: { type: String, required: true, ref: 'Appointment' },
  Doctor_Id: { type: String, required: true, ref: 'Doctor' },
  Notes: { type: String }
});

//Medicine Prescription Counter
const MedinePresCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

//Medicine Prescription
const MedicinePresSchema = new mongoose.Schema({
    Prescription_Id: { type: String, unique: true },
    Appointment_Id: { type: String, required: true, ref: 'Appointment' },
    Doctor_Id: { type: String, required: true, ref: 'Doctor' },
    Medicine_Id: [{type: String, required:true, ref:'Medicine'}],
    Notes: { type: String }
});

//Lab test prescription counter Schema
const LabPresCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

//Lab test Prescription
const LabPresSchema = new mongoose.Schema({
    LabPrescription_Id: { type: String, unique: true },
    Appointment_Id: { type: String, required: true, ref: 'Appointment' },
    Doctor_Id: { type: String, required: true, ref: 'Doctor' },
    Labtest_Id: [{type: String, required:true, ref:'Medicine'}],
    Notes: { type: String }
});

module.exports = {
  ConsultationCounter: mongoose.model('ConsultationCounter', ConsultationCounterSchema),
  Consultation: mongoose.model('Consultation', ConsultationSchema),
  MedicinePresCounter: mongoose.model('MedicinePresCounter', MedinePresCounterSchema),
  MedicinePres: mongoose.model('MedicinePres', MedicinePresSchema),
  LabPresCounter: mongoose.model('LabPresCounter', LabPresCounterSchema),
  LabPres: mongoose.model('LabPres', LabPresSchema)
};