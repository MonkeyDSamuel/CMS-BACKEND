const mongoose = require('mongoose');

// Staff Schema
const StaffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

// Role Schema
const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

// Specialization Schema
const SpecializationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const Staff = mongoose.model('Staff', StaffSchema);
const Role = mongoose.model('Role', RoleSchema);
const Specialization = mongoose.model('Specialization', SpecializationSchema);

module.exports = {
    Staff,
    Role,
    Specialization
};
