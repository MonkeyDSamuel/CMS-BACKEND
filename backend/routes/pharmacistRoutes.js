const express = require('express');
const router = express.Router();
const pharmacistController = require('../controllers/pharmacistController');
const { verifyToken, checkRole } = require('../login/auth');

// MEDICINE PRESCRIPTION MANAGEMENT (unified namespace)
router.get('/api/prescriptions/medicine', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.listAllMedicinePrescriptions);
router.get('/api/prescriptions/medicine/appointment/:appointmentId', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.getMedicinePrescriptionByAppointmentId);
router.get('/api/prescriptions/medicine/patient/:patientId', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.listMedicinePrescriptionsByPatient);
router.get('/api/prescriptions/medicine/:prescriptionId', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.getMedicinePrescriptionById);
router.put('/api/prescriptions/medicine/:prescriptionId', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.updateMedicinePrescription);
router.patch('/api/prescriptions/medicine/:prescriptionId/deactivate', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.deactivateMedicinePrescription);

// MEDICINE MANAGEMENT
router.post('/api/medicines', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.addMedicine);
router.put('/api/medicines/:medicineId', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.updateMedicine);
router.get('/api/medicines/:medicineId', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.getMedicineById);
router.get('/api/medicines', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.listAllMedicines);
router.patch('/api/medicines/:medicineId/deactivate', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.deactivateMedicine);

// MEDICINE INVENTORY MANAGEMENT
router.post('/api/inventory/medicine', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.addMedicine);
router.put('/api/inventory/medicine/:medicineStockId', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.updateInventoryQuantity);
router.patch('/api/inventory/medicine/:medicineStockId/restock', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.restockInventory);
router.get('/api/inventory/medicine/:medicineId', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.getMedicineById);
router.get('/api/inventory/medicine', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.listAllMedicines);
router.patch('/api/inventory/medicine/:medicineStockId/flag-low', verifyToken, checkRole(['Pharmacist', 'Administrator']), pharmacistController.flagLowStock);

module.exports = router;