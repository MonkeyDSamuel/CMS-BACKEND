const mongoose = require('mongoose');

// Lab Test Counter Schema for auto-incrementing lab_test_id
const LabTestCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Lab Test Result Counter Schema for auto-incrementing labRes_id
const LabTestResultCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const labtechSchema = new mongoose.Schema({
  lab_test_id: {
    type: String,
    unique: true,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  min_reading: {
    type: Number,
    required: true
  },
  max_reading: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const LabTestResultSchema = new mongoose.Schema({
  labRes_id: {
    type: String,
    unique: true,
    required: false
  },
  lab_test_id: {
    type: String,
    required: true
  },
  app_id: {
    type: String,
    required: true
  },
  doc_id: {
    type: String,
    required: true
  },
  min_reading: {
    type: Number,
    required: true
  },
  max_reading: {
    type: Number,
    required: true
  },
  result_notes: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  date_tested: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to auto-increment lab_test_id
labtechSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await LabTestCounter.findOneAndUpdate(
        { _id: 'lab_test_id' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.lab_test_id = `LABTEST${String(counter.seq).padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Pre-save middleware to auto-increment labRes_id and populate min_reading/max_reading
LabTestResultSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Auto-increment labRes_id
      const counter = await LabTestResultCounter.findOneAndUpdate(
        { _id: 'labRes_id' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.labRes_id = `LABRES${String(counter.seq).padStart(4, '0')}`;
      
      // Populate min_reading and max_reading from the corresponding lab test
      if (this.lab_test_id) {
        const labTest = await LabTest.findOne({ lab_test_id: this.lab_test_id });
        if (labTest) {
          this.min_reading = labTest.min_reading;
          this.max_reading = labTest.max_reading;
        } else {
          return next(new Error(`Lab test with ID ${this.lab_test_id} not found`));
        }
      } else {
        return next(new Error('lab_test_id is required'));
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Pre-save middleware to update timestamps
labtechSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

LabTestResultSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-update middleware to update timestamps
labtechSchema.pre('findOneAndUpdate', function(next) {
  this.getUpdate().updatedAt = new Date();
  next();
});

LabTestResultSchema.pre('findOneAndUpdate', function(next) {
  this.getUpdate().updatedAt = new Date();
  next();
});

const LabTestCounter = mongoose.model('LabTestCounter', LabTestCounterSchema);
const LabTestResultCounter = mongoose.model('LabTestResultCounter', LabTestResultCounterSchema);
const LabTest = mongoose.model('LabTest', labtechSchema);
const LabTestResult = mongoose.model('LabTestResult', LabTestResultSchema);

module.exports = {
  LabTest,
  LabTestResult,
  LabTestCounter,
  LabTestResultCounter
};
