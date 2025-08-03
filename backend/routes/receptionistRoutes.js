const express = require('express');
const router = express.Router();
const receptionistController = require('../controllers/receptionistController');
const { routeMiddleware } = require('../utils/routeUtils');

// PATIENT MANAGEMENT
router.post('/api/patients', ...routeMiddleware.receptionist, receptionistController.registerPatient);
router.put('/api/patients/:id', ...routeMiddleware.receptionist, receptionistController.updatePatient);
router.get('/api/patients/:id', ...routeMiddleware.receptionist, receptionistController.getPatientById);
router.get('/api/patients', ...routeMiddleware.receptionist, receptionistController.listAllPatients);
router.patch('/api/patients/:id/deactivate', ...routeMiddleware.receptionist, receptionistController.deactivatePatient);

// APPOINTMENT MANAGEMENT
router.post('/api/appointments', ...routeMiddleware.receptionist, receptionistController.scheduleAppointment);
router.put('/api/appointments/:id', ...routeMiddleware.receptionist, receptionistController.updateAppointment);
router.get('/api/appointments/:id', ...routeMiddleware.receptionist, receptionistController.getAppointmentById);
router.get('/api/appointments', ...routeMiddleware.receptionist, receptionistController.getAppointmentsByDate);
router.patch('/api/appointments/:id/cancel', ...routeMiddleware.receptionist, receptionistController.cancelAppointment);

// CONSULTATION BILLING
router.post('/api/billing', ...routeMiddleware.receptionist, receptionistController.generateBill);
router.put('/api/billing/:appointmentId', ...routeMiddleware.receptionist, receptionistController.updateBill);
router.get('/api/billing/:appointmentId', ...routeMiddleware.receptionist, receptionistController.getBillByAppointmentId);
router.get('/api/billing', ...routeMiddleware.receptionist, receptionistController.getBillsByDateRange);

// APPOINTMENT LISTING
router.get('/api/appointments/patient/:patientId', ...routeMiddleware.receptionist, receptionistController.getAppointmentsByPatient);
router.get('/api/appointments/doctor/:doctorId', ...routeMiddleware.receptionist, receptionistController.getAppointmentsByDoctor);
router.get('/api/appointments/status/:status', ...routeMiddleware.receptionist, receptionistController.getAppointmentsByStatus);

module.exports = router;