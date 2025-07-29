const express = require('express');
const router = express.Router();

const patCtrl = require('../controllers/receptionistController');



router.post('/',patCtrl.registerPatient);
router.put('/', patCtrl.updatePatient);
router.get('/', patCtrl.getAllPatients);
router.get('/id', patCtrl.getPatientById);
router.patch('/id', patCtrl.deactivatePatient);



const appCtrl = require('../controllers/receptionistController');

router.post('/', appCtrl.scheduleAppointment);
router.put('/', appCtrl.updateAppointment);
router.get('/id', appCtrl.getAppointmentById);
router.get('/', appCtrl.getAppointmentsByDate);
router.patch('/id', appCtrl.cancelAppointment);



const BillCtrl = require('../controllers/receptionistController');

router.post('/', BillCtrl.generateBill);
router.put('/', BillCtrl.updateBill);
router.get('/id', BillCtrl.getBillByAppointmentId);
router.get('/', BillCtrl.getAppointmentsByStatus);


module.exports = router;