const express = require('express');
const router = express.Router();
const labtechController = require('../controllers/labtechController');
const { validateLabTest, validateLabTestResult, runValidation } = require('../validators/labtechValidator');

// Lab Test Routes
router.post('/tests', validateLabTest, runValidation, labtechController.createLabTest);
router.get('/tests', labtechController.listAllLabTests);
router.get('/tests/:labTestId', labtechController.getLabTestById);
router.put('/tests/:labTestId', validateLabTest, runValidation, labtechController.updateLabTest);
router.delete('/tests/:labTestId', labtechController.deleteLabTest);
router.patch('/tests/:labTestId/deactivate', labtechController.deactivateLabTest);

// Lab Test Results Routes
router.post('/results', validateLabTestResult, runValidation, labtechController.createLabTestResult);
router.get('/results', labtechController.listAllLabTestResults);
router.get('/results/:resultId', labtechController.getLabTestResultById);
router.put('/results/:resultId', validateLabTestResult, runValidation, labtechController.updateLabTestResult);
router.delete('/results/:resultId', labtechController.deleteLabTestResult);
router.get('/results/appointment/:appointmentId', labtechController.getResultsByAppointment);
router.get('/results/doctor/:doctorId', labtechController.getResultsByDoctor);
router.patch('/results/:resultId/status', labtechController.updateResultStatus);

module.exports = router;

