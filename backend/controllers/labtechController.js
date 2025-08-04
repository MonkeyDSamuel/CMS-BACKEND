const { LabTest } = require('../models/labtech');
const { LabPres } = require('../models/doctor');

const labtechController = {
  // Lab Test CRUD Operations (unchanged)
  createLabTest: async (req, res) => {
    try {
      const labtest = new LabTest({
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await labtest.save();
      res.status(201).json({
        success: true,
        message: 'Lab test created successfully',
        data: labtest
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  updateLabTest: async (req, res) => {
    try {
      const updated = await LabTest.findByIdAndUpdate(
        req.params.labTestId, 
        { ...req.body, updatedAt: new Date() }, 
        { new: true, runValidators: true }
      );
      if (!updated) {
        return res.status(404).json({ 
          success: false,
          error: 'Lab test not found' 
        });
      }
      res.json({
        success: true,
        message: 'Lab test updated successfully',
        data: updated
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  getLabTestById: async (req, res) => {
    try {
      const test = await LabTest.findById(req.params.labTestId);
      if (!test) {
        return res.status(404).json({ 
          success: false,
          error: 'Lab test not found' 
        });
      }
      res.json({
        success: true,
        data: test
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  listAllLabTests: async (req, res) => {
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
      
      const tests = await LabTest.find(query).sort({ createdAt: -1 });
      res.json({
        success: true,
        count: tests.length,
        data: tests
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  deleteLabTest: async (req, res) => {
    try {
      const test = await LabTest.findByIdAndDelete(req.params.labTestId);
      if (!test) {
        return res.status(404).json({ 
          success: false,
          error: 'Lab test not found' 
        });
      }
      res.json({
        success: true,
        message: 'Lab test deleted successfully'
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  deactivateLabTest: async (req, res) => {
    try {
      const test = await LabTest.findByIdAndUpdate(
        req.params.labTestId,
        { status: 'unavailable', updatedAt: new Date() },
        { new: true }
      );
      if (!test) {
        return res.status(404).json({ 
          success: false,
          error: 'Lab test not found' 
        });
      }
      res.json({
        success: true,
        message: 'Lab test deactivated successfully',
        data: test
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  // Lab Test Prescription Management (unified)
  listAllLabTestPrescriptions: async (req, res) => {
    try {
      const { status, startDate, endDate } = req.query;
      let query = {};
      
      if (status) {
        query.status = status;
      }
      
      if (startDate && endDate) {
        query.date_tested = { 
          $gte: new Date(startDate), 
          $lte: new Date(endDate) 
        };
      }
      
      const prescriptions = await LabPres.find(query).sort({ createdAt: -1 });
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

  getLabTestPrescriptionById: async (req, res) => {
    try {
      const prescription = await LabPres.findOne({ LabPrescription_Id: req.params.prescriptionId });
      if (!prescription) {
        return res.status(404).json({ 
          success: false,
          error: 'Lab test prescription not found' 
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

  getLabTestPrescriptionByAppointmentId: async (req, res) => {
    try {
      const prescription = await LabPres.findOne({ Appointment_Id: req.params.appointmentId });
      if (!prescription) {
        return res.status(404).json({ 
          success: false,
          error: 'Lab test prescription not found for this appointment' 
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

  listLabTestPrescriptionsByPatient: async (req, res) => {
    try {
      const { Appointment } = require('../models/receptionist');
      const appointments = await Appointment.find({ patient_id: req.params.patientId });
      const appointmentIds = appointments.map(app => app.App_Id);
      const prescriptions = await LabPres.find({
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

  updateLabTestPrescription: async (req, res) => {
    try {
      const updated = await LabPres.findOneAndUpdate(
        { LabPrescription_Id: req.params.prescriptionId },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ 
          success: false,
          error: 'Lab test prescription not found' 
        });
      }
      res.json({
        success: true,
        message: 'Lab test prescription updated successfully',
        data: updated
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  deactivateLabTestPrescription: async (req, res) => {
    try {
      const updated = await LabPres.findOneAndUpdate(
        { LabPrescription_Id: req.params.prescriptionId },
        { status: 'cancelled', updatedAt: new Date() },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ 
          success: false,
          error: 'Lab test prescription not found' 
        });
      }
      res.json({
        success: true,
        message: 'Lab test prescription deactivated successfully',
        data: updated
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

};

module.exports = labtechController;
