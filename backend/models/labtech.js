const mongoose = require('mongoose');

// Lab Test Counter Schema for auto-incrementing lab_test_id
const LabTestCounterSchema = new mongoose.Schema({
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

// Pre-save middleware to update timestamps

// Pre-save middleware to update timestamps
labtechSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-update middleware to update timestamps
labtechSchema.pre('findOneAndUpdate', function(next) {
  this.getUpdate().updatedAt = new Date();
  next();
});

const LabTestCounter = mongoose.model('LabTestCounter', LabTestCounterSchema);
const LabTest = mongoose.model('LabTest', labtechSchema);

module.exports = {
  LabTest,
  LabTestCounter
};
