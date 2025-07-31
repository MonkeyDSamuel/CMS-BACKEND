const mongoose = require('mongoose');

const labtechSchema = new mongoose.Schema({
  lab_test_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const LabTestResultSchema = new mongoose.Schema({
  labRes_id: { type: String, required: true, unique: true },
  lab_test_id: { type: String, required: true },
  app_id: { type: String, required: true },
  doc_id: { type: String, required: true },
  result_notes: String,
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  date_tested: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const LabTest = mongoose.model('LabTest', labtechSchema);
const LabTestResult = mongoose.model('LabTestResult', LabTestResultSchema);

module.exports = {
  LabTest,
  LabTestResult
};
