const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// 3.1 Consultation Notes
router.post('/api/consultations', doctorController.addConsultationNote);
router.put('/api/consultations/:consultationId', doctorController.updateConsultationNote);
router.get('/api/consultations/appointment/:appointmentId', doctorController.getConsultationByAppointmentId);
router.get('/api/consultations/doctor/:doctorId', doctorController.listConsultationsByDoctor);
router.get('/api/consultations/patient/:patientId', doctorController.listConsultationsByPatient);
router.get('/api/consultations/history/appointment/:appointmentId', doctorController.getConsultationHistoryByAppointmentId);

// 3.2 Medicine Prescription
router.post('/api/prescriptions/medicine', doctorController.createMedicinePrescription);
router.put('/api/prescriptions/medicine/:prescriptionId', doctorController.updateMedicinePrescription);
router.get('/api/prescriptions/medicine/appointment/:appointmentId', doctorController.getMedicinePrescriptionByAppointmentId);
router.get('/api/prescriptions/medicine/patient/:patientId', doctorController.listMedicinePrescriptionsByPatient);
router.get('/api/prescriptions/medicine/history/patient/:patientId', doctorController.listMedicinePrescriptionHistoryByPatient);
router.get('/api/prescriptions/medicine/history/doctor/:doctorId', doctorController.listMedicinePrescriptionHistoryByDoctor);
router.get('/api/prescriptions/medicine/history/appointment/:appointmentId', doctorController.getMedicinePrescriptionHistoryByAppointmentId);

// 3.3 Lab Test Prescription
router.post('/api/prescriptions/labtest', doctorController.createLabTestPrescription);
router.put('/api/prescriptions/labtest/:prescriptionId', doctorController.updateLabTestPrescription);
router.get('/api/prescriptions/labtest/appointment/:appointmentId', doctorController.getLabTestPrescriptionByAppointmentId);
router.get('/api/prescriptions/labtest/patient/:patientId', doctorController.listLabTestPrescriptionsByPatient);
router.get('/api/prescriptions/labtest/history/patient/:patientId', doctorController.listLabTestPrescriptionHistoryByPatient);
router.get('/api/prescriptions/labtest/history/doctor/:doctorId', doctorController.listLabTestPrescriptionHistoryByDoctor);
router.get('/api/prescriptions/labtest/history/appointment/:appointmentId', doctorController.getLabTestPrescriptionHistoryByAppointmentId);

module.exports = router;
