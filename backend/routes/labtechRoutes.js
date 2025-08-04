const express = require('express');
const router = express.Router();
const labtechController = require('../controllers/labtechController');
const { verifyToken, checkRole } = require('../login/auth');
const { validateLabTest, runValidation } = require('../validators/labtechValidator');

// LAB TEST PRESCRIPTION MANAGEMENT (unified namespace)
router.get('/api/prescriptions/labtest', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.listAllLabTestPrescriptions);
router.get('/api/prescriptions/labtest/appointment/:appointmentId', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.getLabTestPrescriptionByAppointmentId);
router.get('/api/prescriptions/labtest/patient/:patientId', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.listLabTestPrescriptionsByPatient);
router.get('/api/prescriptions/labtest/:prescriptionId', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.getLabTestPrescriptionById);
router.put('/api/prescriptions/labtest/:prescriptionId', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.updateLabTestPrescription);
router.patch('/api/prescriptions/labtest/:prescriptionId/deactivate', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.deactivateLabTestPrescription);

// LAB TEST MANAGEMENT
router.post('/api/labtests', verifyToken, checkRole(['Lab Technician', 'Administrator']), validateLabTest, runValidation, labtechController.createLabTest);
router.put('/api/labtests/:labTestId', verifyToken, checkRole(['Lab Technician', 'Administrator']), validateLabTest, runValidation, labtechController.updateLabTest);
router.get('/api/labtests/:labTestId', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.getLabTestById);
router.get('/api/labtests', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.listAllLabTests);
router.patch('/api/labtests/:labTestId/deactivate', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.deactivateLabTest);

module.exports = router;

