const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  medicine_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const InventorySchema = new mongoose.Schema({
  inventory_id: { type: String, required: true, unique: true },
  medicine_id: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  updatedAt: { type: Date, default: Date.now },
  low_stock_flag: { type: Boolean, default: false },
  status: { type: String, enum: ['in_stock', 'out_of_stock'], default: 'in_stock' }
});

const Medicine = mongoose.model('Medicine', MedicineSchema);
const Inventory = mongoose.model('Inventory', InventorySchema);

module.exports = {
  Medicine,
  Inventory
};
