const { Staff, Role, Specialization } = require('../models/admin');
const Doctor = require('../models/doctor');

// Staff Management
exports.createStaff = async (req, res) => {
    try {
        const staff = new Staff(req.body);
        await staff.save();
        res.status(201).json(staff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.staffId, req.body, { new: true });
        if (!staff) return res.status(404).json({ error: 'Staff not found' });
        res.json(staff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.staffId).populate('role');
        if (!staff) return res.status(404).json({ error: 'Staff not found' });
        res.json(staff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.listAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find().populate('role');
        res.json(staff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deactivateStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.staffId, { isActive: false }, { new: true });
        if (!staff) return res.status(404).json({ error: 'Staff not found' });
        res.json(staff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Role Management
exports.createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.roleId, req.body, { new: true });
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.roleId);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.listAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deactivateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.roleId, { isActive: false }, { new: true });
        if (!role) return res.status(404).json({ error: 'Role not found' });
        res.json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Doctor Management
exports.createDoctor = async (req, res) => {
    try {
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(201).json(doctor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.doctorId, req.body, { new: true });
        if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
        res.json(doctor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
        res.json(doctor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.listAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deactivateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.doctorId, { isActive: false }, { new: true });
        if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
        res.json(doctor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Specialization Management
exports.addSpecialization = async (req, res) => {
    try {
        const specialization = new Specialization(req.body);
        await specialization.save();
        res.status(201).json(specialization);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateSpecialization = async (req, res) => {
    try {
        const specialization = await Specialization.findByIdAndUpdate(req.params.specializationId, req.body, { new: true });
        if (!specialization) return res.status(404).json({ error: 'Specialization not found' });
        res.json(specialization);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getSpecializationById = async (req, res) => {
    try {
        const specialization = await Specialization.findById(req.params.specializationId);
        if (!specialization) return res.status(404).json({ error: 'Specialization not found' });
        res.json(specialization);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.listAllSpecializations = async (req, res) => {
    try {
        const specializations = await Specialization.find();
        res.json(specializations);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
