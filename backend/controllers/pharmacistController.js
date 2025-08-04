const { Medicine, MedicineCounter } = require('../models/pharmacist');
const { MedicinePres } = require('../models/doctor');

const pharmacistController = {
  // Medicine Prescription Management (unified)
  listAllMedicinePrescriptions: async (req, res) => {
    try {
      const { status, startDate, endDate } = req.query;
      let query = {};
      
      if (status) {
        query.status = status;
      }
      
      if (startDate && endDate) {
        query.dispensed_at = { 
          $gte: new Date(startDate), 
          $lte: new Date(endDate) 
        };
      }
      
      const prescriptions = await MedicinePres.find(query).sort({ createdAt: -1 });
      res.json({
        success: true,
        count: prescriptions.length,
        data: prescriptions
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  getMedicinePrescriptionById: async (req, res) => {
    try {
      const prescription = await MedicinePres.findOne({ Prescription_Id: req.params.prescriptionId });
      if (!prescription) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine prescription not found' 
        });
      }
      res.json({
        success: true,
        data: prescription
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  getMedicinePrescriptionByAppointmentId: async (req, res) => {
    try {
      const prescription = await MedicinePres.findOne({ Appointment_Id: req.params.appointmentId });
      if (!prescription) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine prescription not found for this appointment' 
        });
      }
      res.json({
        success: true,
        data: prescription
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  listMedicinePrescriptionsByPatient: async (req, res) => {
    try {
      const { Appointment } = require('../models/receptionist');
      const appointments = await Appointment.find({ patient_id: req.params.patientId });
      const appointmentIds = appointments.map(app => app.App_Id);
      const prescriptions = await MedicinePres.find({
        Appointment_Id: { $in: appointmentIds }
      }).sort({ createdAt: -1 });
      res.json({
        success: true,
        count: prescriptions.length,
        data: prescriptions
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  updateMedicinePrescription: async (req, res) => {
    try {
      const updated = await MedicinePres.findOneAndUpdate(
        { Prescription_Id: req.params.prescriptionId },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine prescription not found' 
        });
      }
      res.json({
        success: true,
        message: 'Medicine prescription updated successfully',
        data: updated
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  deactivateMedicinePrescription: async (req, res) => {
    try {
      const updated = await MedicinePres.findOneAndUpdate(
        { Prescription_Id: req.params.prescriptionId },
        { status: 'cancelled', updatedAt: new Date() },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine prescription not found' 
        });
      }
      res.json({
        success: true,
        message: 'Medicine prescription deactivated successfully',
        data: updated
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

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



  updateInventoryQuantity: async (req, res) => {
    try {
      const { quantity } = req.body;
      
      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Quantity must be a positive number'
        });
      }

      // Find the current medicine to get current quantity
      const currentMedicine = await Medicine.findOne({ medicine_id: req.params.medicineStockId });
      if (!currentMedicine) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine inventory not found' 
        });
      }

      // Calculate new quantity (decrease by the entered amount)
      const newQuantity = currentMedicine.quantity - quantity;
      
      if (newQuantity < 0) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock. Current stock: ${currentMedicine.quantity}, requested: ${quantity}`
        });
      }

      // Update the medicine with decreased quantity
      const updatedMedicine = await Medicine.findOneAndUpdate(
        { medicine_id: req.params.medicineStockId },
        { 
          quantity: newQuantity,
          updatedAt: new Date() 
        },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: `Inventory quantity decreased by ${quantity}. New stock: ${newQuantity}`,
        data: updatedMedicine
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  getInventoryByMedicineId: async (req, res) => {
    // Reuse getMedicineById for consistency
    return await pharmacistController.getMedicineById(req, res);
  },

  listAllInventoryItems: async (req, res) => {
    // Reuse listAllMedicines for consistency
    return await pharmacistController.listAllMedicines(req, res);
  },

  restockInventory: async (req, res) => {
    try {
      const { quantity } = req.body;
      
      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Quantity must be a positive number'
        });
      }

      // Find the current medicine to get current quantity
      const currentMedicine = await Medicine.findOne({ medicine_id: req.params.medicineStockId });
      if (!currentMedicine) {
        return res.status(404).json({ 
          success: false,
          error: 'Medicine inventory not found' 
        });
      }

      // Calculate new quantity (increase by the entered amount)
      const newQuantity = currentMedicine.quantity + quantity;

      // Update the medicine with increased quantity
      const updatedMedicine = await Medicine.findOneAndUpdate(
        { medicine_id: req.params.medicineStockId },
        { 
          quantity: newQuantity,
          updatedAt: new Date() 
        },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: `Inventory quantity increased by ${quantity}. New stock: ${newQuantity}`,
        data: updatedMedicine
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
