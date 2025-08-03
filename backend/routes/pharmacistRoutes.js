const express = require('express');
const router = express.Router();
const pharmacistController = require('../controllers/pharmacistController');
const { verifyToken, checkRole } = require('../login/auth');

// MEDICINE MANAGEMENT
router.post('/api/medicines', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.addMedicine);
router.put('/api/medicines/:medicineId', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.updateMedicine);
router.get('/api/medicines/:medicineId', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.getMedicineById);
router.get('/api/medicines', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.listAllMedicines);
router.patch('/api/medicines/:medicineId/deactivate', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.deactivateMedicine);

// MEDICINE INVENTORY MANAGEMENT
router.post('/api/inventory/medicine', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.addInventoryItem);
router.put('/api/inventory/medicine/:medicineStockId', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.updateInventoryQuantity);
router.get('/api/inventory/medicine/:medicineId', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.getInventoryByMedicineId);
router.get('/api/inventory/medicine', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.listAllInventoryItems);
router.patch('/api/inventory/medicine/:medicineStockId/flag-low', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.flagLowStock);

module.exports = router;