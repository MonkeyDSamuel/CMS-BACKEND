const { Medicine, MedicineCounter } = require('../models/pharmacist');

const pharmacistController = {
  // Medicine CRUD Operations
  addMedicine: async (req, res) => {
    try {
      const med = new Medicine({
        ...req.body,
        addedAt: new Date(),
        updatedAt: new Date()
      });
      await med.save();
      res.status(201).json({
        success: true,
        message: 'Medicine added successfully',
        data: med
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  updateMedicine: async (req, res) => {
    try {
      const updated = await Medicine.findByIdAndUpdate(
        req.params.medicineId, 
        { ...req.body, updatedAt: new Date() }, 
        { new: true, runValidators: true }
      );
      if (!updated) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine not found' 
        });
      }
      res.json({
        success: true,
        message: 'Medicine updated successfully',
        data: updated
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  getMedicineById: async (req, res) => {
    try {
      const med = await Medicine.findById(req.params.medicineId);
      if (!med) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine not found' 
        });
      }
      res.json({
        success: true,
        data: med
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  listAllMedicines: async (req, res) => {
    try {
      const { status, search, low_stock } = req.query;
      let query = {};
      
      if (status) {
        query.status = status;
      }
      
      if (low_stock === 'true') {
        query.low_stock_flag = true;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      const meds = await Medicine.find(query).sort({ addedAt: -1 });
      res.json({
        success: true,
        count: meds.length,
        data: meds
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  deleteMedicine: async (req, res) => {
    try {
      const med = await Medicine.findByIdAndDelete(req.params.medicineId);
      if (!med) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine not found' 
        });
      }
      res.json({
        success: true,
        message: 'Medicine deleted successfully'
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  deactivateMedicine: async (req, res) => {
    try {
      const med = await Medicine.findByIdAndUpdate(
        req.params.medicineId, 
        { status: 'unavailable', updatedAt: new Date() }, 
        { new: true }
      );
      if (!med) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine not found' 
        });
      }
      res.json({
        success: true,
        message: 'Medicine deactivated successfully',
        data: med
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  // Update medicine quantity
  updateMedicineQuantity: async (req, res) => {
    try {
      const { quantity } = req.body;
      const updated = await Medicine.findByIdAndUpdate(
        req.params.medicineId,
        { 
          quantity,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );
      
      if (!updated) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine not found' 
        });
      }
      
      res.json({
        success: true,
        message: 'Medicine quantity updated successfully',
        data: updated
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  // Get low stock medicines
  getLowStockMedicines: async (req, res) => {
    try {
      const meds = await Medicine.find({ low_stock_flag: true }).sort({ updatedAt: -1 });
      res.json({
        success: true,
        count: meds.length,
        data: meds
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  // MEDICINE INVENTORY MANAGEMENT
  addInventoryItem: async (req, res) => {
    // Reuse addMedicine function for consistency
    return await pharmacistController.addMedicine(req, res);
  },

  updateInventoryQuantity: async (req, res) => {
    try {
      const medicine = await Medicine.findOneAndUpdate(
        { medicine_id: req.params.medicineStockId },
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      if (!medicine) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine inventory not found' 
        });
      }
      res.json({
        success: true,
        message: 'Inventory quantity updated successfully',
        data: medicine
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  getInventoryByMedicineId: async (req, res) => {
    try {
      const medicine = await Medicine.findOne({ medicine_id: req.params.medicineId });
      if (!medicine) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine inventory not found' 
        });
      }
      res.json({
        success: true,
        data: medicine
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  listAllInventoryItems: async (req, res) => {
    try {
      const medicines = await Medicine.find().sort({ updatedAt: -1 });
      res.json({
        success: true,
        count: medicines.length,
        data: medicines
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  flagLowStock: async (req, res) => {
    try {
      const medicine = await Medicine.findOneAndUpdate(
        { medicine_id: req.params.medicineStockId },
        { low_stock_flag: true, updatedAt: new Date() },
        { new: true }
      );
      if (!medicine) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine inventory not found' 
        });
      }
      res.json({
        success: true,
        message: 'Medicine flagged as low stock',
        data: medicine
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  }
};

module.exports = pharmacistController;
