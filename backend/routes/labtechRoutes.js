const express = require('express');
const router = express.Router();
const labtechController = require('../controllers/labtechController');
const { verifyToken, checkRole } = require('../login/auth');
const { validateLabTest, validateLabTestResult, runValidation } = require('../validators/labtechValidator');

// LAB TEST PRESCRIPTION MANAGEMENT
router.put('/api/labtests/results/:labTestPrescriptionId', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.recordLabTestResult);
router.get('/api/labtests/results/appointment/:appointmentId', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.getLabTestResultByAppointmentId);
router.get('/api/labtests/results', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.listLabTestResultsByDateRange);
router.patch('/api/labtests/:labTestPrescriptionId/deactivate', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.deactivateLabTestPrescription);

// LAB TEST MANAGEMENT
router.post('/api/labtests', verifyToken, checkRole(['Lab Technician', 'Administrator']), validateLabTest, runValidation, labtechController.createLabTest);
router.put('/api/labtests/:labTestId', verifyToken, checkRole(['Lab Technician', 'Administrator']), validateLabTest, runValidation, labtechController.updateLabTest);
router.get('/api/labtests/:labTestId', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.getLabTestById);
router.get('/api/labtests', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.listAllLabTests);
router.patch('/api/labtests/:labTestId/deactivate', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.deactivateLabTest);

// LAB TEST RESULTS MANAGEMENT
router.post('/api/labtest-results', verifyToken, checkRole(['Lab Technician', 'Administrator']), validateLabTestResult, runValidation, labtechController.createLabTestResult);
router.put('/api/labtest-results/:resultId', verifyToken, checkRole(['Lab Technician', 'Administrator']), validateLabTestResult, runValidation, labtechController.updateLabTestResult);
router.get('/api/labtest-results/:resultId', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.getLabTestResultById);
router.get('/api/labtest-results', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.listAllLabTestResults);
router.delete('/api/labtest-results/:resultId', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.deleteLabTestResult);
router.get('/api/labtest-results/appointment/:appointmentId', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.getResultsByAppointment);
router.get('/api/labtest-results/doctor/:doctorId', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.getResultsByDoctor);
router.patch('/api/labtest-results/:resultId/status', verifyToken, checkRole(['Lab Technician', 'Administrator']), labtechController.updateResultStatus);

module.exports = router;

