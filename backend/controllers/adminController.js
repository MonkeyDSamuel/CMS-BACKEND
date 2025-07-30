const { Staff, Specialization, Doctor } = require('../models/admin');

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
        const staff = await Staff.findOneAndUpdate({ Staff_Id: req.params.staffId }, req.body, { new: true });
        if (!staff) return res.status(404).json({ error: 'Staff not found' });
        res.json(staff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findOne({ Staff_Id: req.params.staffId });
        if (!staff) return res.status(404).json({ error: 'Staff not found' });
        res.json(staff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.listAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find();
        res.json(staff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deactivateStaff = async (req, res) => {
    try {
        const staff = await Staff.findOneAndUpdate({ Staff_Id: req.params.staffId }, { isActive: false }, { new: true });
        if (!staff) return res.status(404).json({ error: 'Staff not found' });
        res.json(staff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Doctor Management
exports.createDoctor = async (req, res) => {
    try {
        // Ensure specialization is a valid Specialization_Id
        const specialization = await Specialization.findOne({ Specialization_Id: req.body.specialization });
        if (!specialization) return res.status(400).json({ error: 'Invalid Specialization_Id' });
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(201).json(doctor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate({ Doctor_Id: req.params.doctorId }, req.body, { new: true });
        if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
        res.json(doctor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ Doctor_Id: req.params.doctorId });
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
        const doctor = await Doctor.findOneAndUpdate({ Doctor_Id: req.params.doctorId }, { isActive: false }, { new: true });
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
        const specialization = await Specialization.findOneAndUpdate({ Specialization_Id: req.params.specializationId }, req.body, { new: true });
        if (!specialization) return res.status(404).json({ error: 'Specialization not found' });
        res.json(specialization);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getSpecializationById = async (req, res) => {
    try {
        const specialization = await Specialization.findOne({ Specialization_Id: req.params.specializationId });
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
