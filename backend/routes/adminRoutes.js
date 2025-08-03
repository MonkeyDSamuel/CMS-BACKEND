const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../login/auth');

// STAFF MANAGEMENT
router.post('/api/staff', verifyToken, checkRole(['Administrator']), adminController.createStaff);
router.put('/api/staff/:staffId', verifyToken, checkRole(['Administrator']), adminController.updateStaff);
router.get('/api/staff/:staffId', verifyToken, checkRole(['Administrator']), adminController.getStaffById);
router.get('/api/staff', verifyToken, checkRole(['Administrator']), adminController.listAllStaff);
router.patch('/api/staff/:staffId/deactivate', verifyToken, checkRole(['Administrator']), adminController.deactivateStaff);

// DOCTOR MANAGEMENT
router.post('/api/doctors', verifyToken, checkRole(['Administrator']), adminController.createDoctor);
router.put('/api/doctors/:doctorId', verifyToken, checkRole(['Administrator']), adminController.updateDoctor);
router.get('/api/doctors/:doctorId', verifyToken, checkRole(['Administrator']), adminController.getDoctorById);
router.get('/api/doctors', verifyToken, checkRole(['Administrator']), adminController.listAllDoctors);
router.patch('/api/doctors/:doctorId/deactivate', verifyToken, checkRole(['Administrator']), adminController.deactivateDoctor);

// PATIENT ASSIGNMENT MANAGEMENT
router.post('/api/doctors/:doctorId/assign-patients', verifyToken, checkRole(['Administrator']), adminController.assignPatientsToDoctor);
router.delete('/api/doctors/:doctorId/remove-patients', verifyToken, checkRole(['Administrator']), adminController.removePatientsFromDoctor);
router.get('/api/doctors/:doctorId/assigned-patients', verifyToken, checkRole(['Administrator']), adminController.getDoctorAssignedPatients);

// SPECIALIZATION MANAGEMENT
router.post('/api/specializations', verifyToken, checkRole(['Administrator']), adminController.addSpecialization);
router.put('/api/specializations/:specializationId', verifyToken, checkRole(['Administrator']), adminController.updateSpecialization);
router.get('/api/specializations/:specializationId', verifyToken, checkRole(['Administrator']), adminController.getSpecializationById);
router.get('/api/specializations', verifyToken, checkRole(['Administrator']), adminController.listAllSpecializations);

module.exports = router;
