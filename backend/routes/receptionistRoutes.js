const express = require('express');
const router = express.Router();

const patCtrl = require('../controllers/receptionistController');

const {validatePatientRegistration} = require('../validators/receptionistValidator');
const {validatePatientUpdate} = require('../validators/receptionistValidator');
const {validatePatientId} = require('../validators/receptionistValidator');
const {validatePatientList} = require('../validators/receptionistValidator');

router.post('/patients', validatePatientRegistration, patCtrl.registerPatient);
router.put('/patients/:id', validatePatientUpdate, patCtrl.updatePatient);
router.get('/patients', validatePatientList, patCtrl.getAllPatients);
router.get('/patients/:id', validatePatientId, patCtrl.getPatientById);
router.patch('/patients/:id/deactivate', patCtrl.deactivatePatient);

const {validateAppointmentSchedule} = require('../validators/receptionistValidator');
const {validateAppointmentUpdate} = require('../validators/receptionistValidator');
const {validateAppointmentId} = require('../validators/receptionistValidator');
const {validateAppointmentList} = require('../validators/receptionistValidator');

router.post('/Appointment', validateAppointmentSchedule, patCtrl.scheduleAppointment);
router.put('/Appointment/:id', validateAppointmentUpdate, patCtrl.updateAppointment);
router.get('/Appointment/:id', validateAppointmentId, patCtrl.getAppointmentById);
router.get('/Appointment', validateAppointmentList, patCtrl.getAppointmentsByDate);
router.patch('/Appointment/:id', patCtrl.cancelAppointment);

const {validateBillGeneration} = require('../validators/receptionistValidator');
const {validateBillUpdate} = require('../validators/receptionistValidator');
const {validateBillList} = require('../validators/receptionistValidator');

router.post('/bill', validateBillGeneration, patCtrl.generateBill);
router.put('/bill/:id', validateBillUpdate, patCtrl.updateBill);
router.get('/bill/:id', validateBillUpdate, patCtrl.getBillByAppointmentId);
router.get('/bill', validateBillList, patCtrl.getAppointmentsByStatus);

module.exports = router;