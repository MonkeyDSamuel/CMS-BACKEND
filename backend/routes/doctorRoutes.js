const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { verifyToken, checkRole } = require('../login/auth');
const { checkDoctorPatientAccess, checkDoctorAppointmentAccess, filterDoctorOwnData } = require('../middleware/doctorAccess');

// CONSULTATION NOTES
router.post('/api/consultations', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.addConsultationNote);
router.put('/api/consultations/:consultationId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.updateConsultationNote);
router.get('/api/consultations/appointment/:appointmentId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.getConsultationByAppointmentId);
router.get('/api/consultations/doctor/:doctorId', verifyToken, checkRole(['Doctor', 'Administrator']), filterDoctorOwnData, doctorController.listConsultationsByDoctor);

// MEDICINE PRESCRIPTION
router.post('/api/prescriptions/medicine', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.createMedicinePrescription);
router.put('/api/prescriptions/medicine/:prescriptionId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.updateMedicinePrescription);
router.get('/api/prescriptions/medicine/appointment/:appointmentId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.getMedicinePrescriptionByAppointmentId);
router.get('/api/prescriptions/medicine/patient/:patientId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorPatientAccess, doctorController.listMedicinePrescriptionsByPatient);
router.delete('/api/prescriptions/medicine/:prescriptionId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.deleteMedicinePrescription);

// LAB TEST PRESCRIPTION
router.post('/api/prescriptions/labtest', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.createLabTestPrescription);
router.put('/api/prescriptions/labtest/:prescriptionId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.updateLabTestPrescription);
router.get('/api/prescriptions/labtest/appointment/:appointmentId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.getLabTestPrescriptionByAppointmentId);
router.get('/api/prescriptions/labtest/patient/:patientId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorPatientAccess, doctorController.listLabTestPrescriptionsByPatient);
router.delete('/api/prescriptions/labtest/:prescriptionId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.deleteLabTestPrescription);

// CONSULTATION HISTORY
router.get('/api/consultations/patient/:patientId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorPatientAccess, doctorController.listConsultationsByPatient);
router.get('/api/consultations/history/appointment/:appointmentId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.getConsultationHistoryByAppointmentId);

// MEDICINE PRESCRIPTION HISTORY
router.get('/api/prescriptions/medicine/history/patient/:patientId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorPatientAccess, doctorController.listMedicinePrescriptionHistoryByPatient);
router.get('/api/prescriptions/medicine/history/doctor/:doctorId', verifyToken, checkRole(['Doctor', 'Administrator']), filterDoctorOwnData, doctorController.listMedicinePrescriptionHistoryByDoctor);
router.get('/api/prescriptions/medicine/history/appointment/:appointmentId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.getMedicinePrescriptionHistoryByAppointmentId);

// LAB TEST PRESCRIPTION HISTORY
router.get('/api/prescriptions/labtest/history/patient/:patientId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorPatientAccess, doctorController.listLabTestPrescriptionHistoryByPatient);
router.get('/api/prescriptions/labtest/history/doctor/:doctorId', verifyToken, checkRole(['Doctor', 'Administrator']), filterDoctorOwnData, doctorController.listLabTestPrescriptionHistoryByDoctor);
router.get('/api/prescriptions/labtest/history/appointment/:appointmentId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.getLabTestPrescriptionHistoryByAppointmentId);

module.exports = router;
