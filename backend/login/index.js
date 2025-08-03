const express = require('express');
const router = express.Router();
const auth = require('./auth');

// Authentication Routes
router.post('/api/auth/admin', auth.adminLogin);
router.post('/api/auth/receptionist', auth.receptionistLogin);
router.post('/api/auth/doctor', auth.doctorLogin);
router.post('/api/auth/labtech', auth.labtechLogin);
router.post('/api/auth/pharmacist', auth.pharmacistLogin);

module.exports = router; 