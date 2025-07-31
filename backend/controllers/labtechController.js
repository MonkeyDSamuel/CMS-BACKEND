const { LabTest, LabTestResult } = require('../models/labtech');
const { v4: uuidv4 } = require('uuid');

const labtechController = {
  // Lab Test CRUD Operations
  createLabTest: async (req, res) => {
    try {
      const labtest = new LabTest({
        ...req.body,
        lab_test_id: 'LAB-' + uuidv4(),
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

  // Lab Test Results CRUD Operations
  createLabTestResult: async (req, res) => {
    try {
      const result = new LabTestResult(req.body);
      await result.save();
      res.status(201).json({
        success: true,
        message: 'Lab test result created successfully',
        data: result
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  updateLabTestResult: async (req, res) => {
    try {
      const updated = await LabTestResult.findByIdAndUpdate(
        req.params.resultId,
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      if (!updated) {
        return res.status(404).json({ 
          success: false,
          error: 'Lab test result not found' 
        });
      }
      res.json({
        success: true,
        message: 'Lab test result updated successfully',
        data: updated
      });
    } catch (err) {
      res.status(400).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  getLabTestResultById: async (req, res) => {
    try {
      const result = await LabTestResult.findById(req.params.resultId);
      if (!result) {
        return res.status(404).json({ 
          success: false,
          error: 'Lab test result not found' 
        });
      }
      res.json({
        success: true,
        data: result
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  listAllLabTestResults: async (req, res) => {
    try {
      const { status, startDate, endDate, lab_test_id } = req.query;
      let query = {};
      
      if (status) {
        query.status = status;
      }
      
      if (lab_test_id) {
        query.lab_test_id = lab_test_id;
      }
      
      if (startDate && endDate) {
        query.date_tested = { 
          $gte: new Date(startDate), 
          $lte: new Date(endDate) 
        };
      }
      
      const results = await LabTestResult.find(query).sort({ date_tested: -1 });
      res.json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  deleteLabTestResult: async (req, res) => {
    try {
      const result = await LabTestResult.findByIdAndDelete(req.params.resultId);
      if (!result) {
        return res.status(404).json({ 
          success: false,
          error: 'Lab test result not found' 
        });
      }
      res.json({
        success: true,
        message: 'Lab test result deleted successfully'
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  getResultsByAppointment: async (req, res) => {
    try {
      const results = await LabTestResult.find({ 
        app_id: req.params.appointmentId 
      }).sort({ date_tested: -1 });
      
      res.json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  getResultsByDoctor: async (req, res) => {
    try {
      const results = await LabTestResult.find({ 
        doc_id: req.params.doctorId 
      }).sort({ date_tested: -1 });
      
      res.json({
        success: true,
        count: results.length,
        data: results
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  },

  updateResultStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await LabTestResult.findByIdAndUpdate(
        req.params.resultId,
        { status, updatedAt: new Date() },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ 
          success: false,
          error: 'Lab test result not found' 
        });
      }
      res.json({
        success: true,
        message: 'Lab test result status updated successfully',
        data: updated
      });
    } catch (err) {
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
  }
};

module.exports = labtechController;
