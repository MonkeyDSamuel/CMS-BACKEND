const { Medicine, Inventory } = require('../models/pharmacist');
const { v4: uuidv4 } = require('uuid');

const pharmacistController = {
  // Medicine CRUD Operations
  addMedicine: async (req, res) => {
    try {
      const med = new Medicine({
        ...req.body,
        medicine_id: 'MED-' + uuidv4(),
        createdAt: new Date(),
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
      const { status, search } = req.query;
      let query = {};
      
      if (status) {
        query.status = status;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      const meds = await Medicine.find(query).sort({ createdAt: -1 });
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

  // Inventory CRUD Operations
  addInventory: async (req, res) => {
    try {
      const { quantity } = req.body;
      const data = {
        ...req.body,
        low_stock_flag: quantity < 10,
        status: quantity > 0 ? 'in_stock' : 'out_of_stock'
      };
      const inv = new Inventory(data);
      await inv.save();
      res.status(201).json({
        success: true,
        message: 'Inventory added successfully',
        data: inv
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  updateInventory: async (req, res) => {
    try {
      const { quantity } = req.body;
      const updated = await Inventory.findOneAndUpdate(
        { inventory_id: req.params.inventoryId },
        {
          quantity,
          updatedAt: new Date(),
          low_stock_flag: quantity < 10,
          status: quantity > 0 ? 'in_stock' : 'out_of_stock'
        },
        { new: true, runValidators: true }
      );
      if (!updated) {
        return res.status(404).json({ 
          success: false,
          error: 'Inventory not found' 
        });
      }
      res.json({
        success: true,
        message: 'Inventory updated successfully',
        data: updated
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  getInventory: async (req, res) => {
    try {
      const { status, low_stock } = req.query;
      let query = {};
      
      if (status) {
        query.status = status;
      }
      
      if (low_stock === 'true') {
        query.low_stock_flag = true;
      }
      
      const inv = await Inventory.find(query).sort({ updatedAt: -1 });
      res.json({
        success: true,
        count: inv.length,
        data: inv
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  getInventoryById: async (req, res) => {
    try {
      const inv = await Inventory.findOne({ inventory_id: req.params.inventoryId });
      if (!inv) {
        return res.status(404).json({ 
          success: false,
          error: 'Inventory not found' 
        });
      }
      res.json({
        success: true,
        data: inv
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  deleteInventory: async (req, res) => {
    try {
      const inv = await Inventory.findOneAndDelete({ inventory_id: req.params.inventoryId });
      if (!inv) {
        return res.status(404).json({ 
          success: false,
          error: 'Inventory not found' 
        });
      }
      res.json({
        success: true,
        message: 'Inventory deleted successfully'
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  }
};

module.exports = pharmacistController;
