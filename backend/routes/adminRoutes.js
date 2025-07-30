const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Staff Management
router.post('/staff', adminController.createStaff);
router.put('/staff/:staffId', adminController.updateStaff);
router.get('/staff/:staffId', adminController.getStaffById);
router.get('/staff', adminController.listAllStaff);
router.patch('/staff/:staffId/deactivate', adminController.deactivateStaff);

// Doctor Management
router.post('/doctors', adminController.createDoctor);
router.put('/doctors/:doctorId', adminController.updateDoctor);
router.get('/doctors/:doctorId', adminController.getDoctorById);
router.get('/doctors', adminController.listAllDoctors);
router.patch('/doctors/:doctorId/deactivate', adminController.deactivateDoctor);

// Specialization Management
router.post('/specializations', adminController.addSpecialization);
router.put('/specializations/:specializationId', adminController.updateSpecialization);
router.get('/specializations/:specializationId', adminController.getSpecializationById);
router.get('/specializations', adminController.listAllSpecializations);

module.exports = router;
