const mongoose = require('mongoose');

// Medicine Counter Schema for auto-incrementing medicine_id
const MedicineCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Merged Medicine Schema
const MedicineSchema = new mongoose.Schema({
  medicine_id: {
    type: String,
    unique: true,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  price_per_unit: {
    type: Number,
    required: true,
    min: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  low_stock_flag: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to auto-increment medicine_id
MedicineSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await MedicineCounter.findOneAndUpdate(
        { _id: 'medicine_id' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.medicine_id = `MED${String(counter.seq).padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Pre-save middleware to update low_stock_flag based on quantity
MedicineSchema.pre('save', function(next) {
  this.low_stock_flag = this.quantity < 20;
  this.updatedAt = new Date();
  next();
});

// Pre-update middleware to update low_stock_flag when quantity changes
MedicineSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.quantity !== undefined) {
    update.low_stock_flag = update.quantity < 20;
  }
  update.updatedAt = new Date();
  next();
});

const MedicineCounter = mongoose.model('MedicineCounter', MedicineCounterSchema);
const Medicine = mongoose.model('Medicine', MedicineSchema);

module.exports = {
  Medicine,
  MedicineCounter
};
