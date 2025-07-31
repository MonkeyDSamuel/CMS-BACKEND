const {
  Consultation,
  MedicinePres,
  LabPres
} = require('../models/doctor');

// 3.1 Consultation Notes
exports.addConsultationNote = async (req, res) => {
  try {
    const consultation = new Consultation(req.body);
    await consultation.save();
    res.status(201).json(consultation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateConsultationNote = async (req, res) => {
  try {
    const updated = await Consultation.findOneAndUpdate(
      { Consultation_Id: req.params.consultationId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Consultation not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getConsultationByAppointmentId = async (req, res) => {
  try {
    const consultation = await Consultation.findOne({ Appointment_Id: req.params.appointmentId });
    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });
    res.json(consultation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listConsultationsByDoctor = async (req, res) => {
  try {
    const consultations = await Consultation.find({ Doctor_Id: req.params.doctorId });
    res.json(consultations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listConsultationsByPatient = async (req, res) => {
  try {
    const consultations = await Consultation.find({ Patient_Id: req.params.patientId });
    res.json(consultations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getConsultationHistoryByAppointmentId = async (req, res) => {
  try {
    const consultation = await Consultation.findOne({ Appointment_Id: req.params.appointmentId });
    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });
    res.json(consultation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 3.2 Medicine Prescription
exports.createMedicinePrescription = async (req, res) => {
  try {
    const prescription = new MedicinePres(req.body);
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMedicinePrescription = async (req, res) => {
  try {
    const updated = await MedicinePres.findOneAndUpdate(
      { Prescription_Id: req.params.prescriptionId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Prescription not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMedicinePrescriptionByAppointmentId = async (req, res) => {
  try {
    const prescription = await MedicinePres.findOne({ Appointment_Id: req.params.appointmentId });
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listMedicinePrescriptionsByPatient = async (req, res) => {
  try {
    const prescriptions = await MedicinePres.find({ Patient_Id: req.params.patientId });
    res.json(prescriptions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listMedicinePrescriptionHistoryByPatient = async (req, res) => {
  try {
    const prescriptions = await MedicinePres.find({ Patient_Id: req.params.patientId });
    res.json(prescriptions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listMedicinePrescriptionHistoryByDoctor = async (req, res) => {
  try {
    const prescriptions = await MedicinePres.find({ Doctor_Id: req.params.doctorId });
    res.json(prescriptions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMedicinePrescriptionHistoryByAppointmentId = async (req, res) => {
  try {
    const prescription = await MedicinePres.findOne({ Appointment_Id: req.params.appointmentId });
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 3.3 Lab Test Prescription
exports.createLabTestPrescription = async (req, res) => {
  try {
    const prescription = new LabPres(req.body);
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateLabTestPrescription = async (req, res) => {
  try {
    const updated = await LabPres.findOneAndUpdate(
      { LabPrescription_Id: req.params.prescriptionId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Lab Test Prescription not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLabTestPrescriptionByAppointmentId = async (req, res) => {
  try {
    const prescription = await LabPres.findOne({ Appointment_Id: req.params.appointmentId });
    if (!prescription) return res.status(404).json({ error: 'Lab Test Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listLabTestPrescriptionsByPatient = async (req, res) => {
  try {
    const prescriptions = await LabPres.find({ Patient_Id: req.params.patientId });
    res.json(prescriptions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listLabTestPrescriptionHistoryByPatient = async (req, res) => {
  try {
    const prescriptions = await LabPres.find({ Patient_Id: req.params.patientId });
    res.json(prescriptions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listLabTestPrescriptionHistoryByDoctor = async (req, res) => {
  try {
    const prescriptions = await LabPres.find({ Doctor_Id: req.params.doctorId });
    res.json(prescriptions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLabTestPrescriptionHistoryByAppointmentId = async (req, res) => {
  try {
    const prescription = await LabPres.findOne({ Appointment_Id: req.params.appointmentId });
    if (!prescription) return res.status(404).json({ error: 'Lab Test Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
