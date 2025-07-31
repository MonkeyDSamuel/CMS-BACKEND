const express = require('express');
const router = express.Router();
const pharmacistController = require('../controllers/pharmacistController');
const { validateMedicine, validateInventory, runValidation } = require('../validators/pharmacistValidator');

// Medicine Routes
router.post('/medicines', validateMedicine, runValidation, pharmacistController.addMedicine);
router.get('/medicines', pharmacistController.listAllMedicines);
router.get('/medicines/:medicineId', pharmacistController.getMedicineById);
router.put('/medicines/:medicineId', validateMedicine, runValidation, pharmacistController.updateMedicine);
router.delete('/medicines/:medicineId', pharmacistController.deleteMedicine);
router.patch('/medicines/:medicineId/deactivate', pharmacistController.deactivateMedicine);

// Inventory Routes
router.post('/inventory', validateInventory, runValidation, pharmacistController.addInventory);
router.get('/inventory', pharmacistController.getInventory);
router.get('/inventory/:inventoryId', pharmacistController.getInventoryById);
router.put('/inventory/:inventoryId', validateInventory, runValidation, pharmacistController.updateInventory);
router.delete('/inventory/:inventoryId', pharmacistController.deleteInventory);

module.exports = router;