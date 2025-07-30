const { Patient, Appointment, Billing } = require('../models/receptionist');

// Register Patient: POST /api/patients
const registerPatient = async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json({
            success: true,
            message: 'Patient registered successfully',
            data: patient
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to register patient',
            error: error.message
        });
    }
};

// Update Patient Information: PUT /api/patients/{id}
const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Patient updated successfully',
            data: patient
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update patient',
            error: error.message
        });
    }
};

// Get Patient by ID: GET /api/patients/{id}
const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id);
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        res.json({
            success: true,
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get patient',
            error: error.message
        });
    }
};

// List All Patients: GET /api/patients
const getAllPatients = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        
        let query = { status: 'active' };
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        
        const patients = await Patient.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });
            
        const total = await Patient.countDocuments(query);
        
        res.json({
            success: true,
            data: patients,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(total / limit),
                total_records: total,
                records_per_page: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get patients',
            error: error.message
        });
    }
};

// Deactivate Patient: PATCH /api/patients/{id}
const deactivatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findByIdAndUpdate(
            id,
            { status: 'inactive' },
            { new: true }
        );
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Patient deactivated successfully',
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to deactivate patient',
            error: error.message
        });
    }
};

// Schedule Appointment: POST /api/Appointment
const scheduleAppointment = async (req, res) => {
    try {
        const appointment = new Appointment({
            ...req.body,
            created_by_staff: req.user?.id || 'staff_id' // Assuming user is authenticated
        });
        await appointment.save();
        
        // Populate patient and doctor details
        await appointment.populate(['patient_id', 'doctor_id']);
        
        res.status(201).json({
            success: true,
            message: 'Appointment scheduled successfully',
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to schedule appointment',
            error: error.message
        });
    }
};

// Update Appointment: PUT /api/Appointment/{id}
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate(['patient_id', 'doctor_id']);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Appointment updated successfully',
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update appointment',
            error: error.message
        });
    }
};

// Get Appointment by ID: GET /api/Appointment/{id}
const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id)
            .populate(['patient_id', 'doctor_id', 'created_by_staff']);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        res.json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get appointment',
            error: error.message
        });
    }
};

// List Appointments by Date: GET /api/Appointment?date={appointmentDate}
const getAppointmentsByDate = async (req, res) => {
    try {
        const { date, page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            
            query.scheduled_date = {
                $gte: startDate,
                $lt: endDate
            };
        }
        
        const appointments = await Appointment.find(query)
            .populate(['patient_id', 'doctor_id'])
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ scheduled_date: 1 });
            
        const total = await Appointment.countDocuments(query);
        
        res.json({
            success: true,
            data: appointments,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(total / limit),
                total_records: total,
                records_per_page: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get appointments',
            error: error.message
        });
    }
};

// Cancel Appointment: PATCH /api/Appointment/{id}
const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status: 'cancelled' },
            { new: true }
        ).populate(['patient_id', 'doctor_id']);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Appointment cancelled successfully',
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to cancel appointment',
            error: error.message
        });
    }
};

// Generate Appointment Bill: POST /api/bill
const generateBill = async (req, res) => {
    try {
        const { appointment_id, amount } = req.body;
        
        // Check if appointment exists and is completed
        const appointment = await Appointment.findById(appointment_id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        if (appointment.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot generate bill for incomplete appointment'
            });
        }
        
        // Check if bill already exists
        const existingBill = await Billing.findOne({ appointment_id });
        if (existingBill) {
            return res.status(400).json({
                success: false,
                message: 'Bill already exists for this appointment'
            });
        }
        
        const bill = new Billing({
            appointment_id,
            amount,
            status: 'unpaid'
        });
        
        await bill.save();
        await bill.populate({
            path: 'appointment_id',
            populate: ['patient_id', 'doctor_id']
        });
        
        res.status(201).json({
            success: true,
            message: 'Bill generated successfully',
            data: bill
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to generate bill',
            error: error.message
        });
    }
};

// Update Appointment Bill: PUT /api/bill/{id}
const updateBill = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await Billing.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate({
            path: 'appointment_id',
            populate: ['patient_id', 'doctor_id']
        });
        
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Bill updated successfully',
            data: bill
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update bill',
            error: error.message
        });
    }
};

// Get Bill by Appointment ID: GET /api/bill/{id}
const getBillByAppointmentId = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await Billing.findOne({ appointment_id: id })
            .populate({
                path: 'appointment_id',
                populate: ['patient_id', 'doctor_id']
            });
        
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }
        
        res.json({
            success: true,
            data: bill
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get bill',
            error: error.message
        });
    }
};

// Get Appointments with Status: GET /api/bill
const getAppointmentsByStatus = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        
        let query = {};
        if (status) {
            query.status = status;
        }
        
        const appointments = await Appointment.find(query)
            .populate(['patient_id', 'doctor_id'])
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ scheduled_date: 1 });
            
        const total = await Appointment.countDocuments(query);
        
        res.json({
            success: true,
            data: appointments,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(total / limit),
                total_records: total,
                records_per_page: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get appointments by status',
            error: error.message
        });
    }
};

module.exports = {
    registerPatient,
    updatePatient,
    getPatientById,
    getAllPatients,
    deactivatePatient,
    scheduleAppointment,
    updateAppointment,
    getAppointmentById,
    getAppointmentsByDate,
    cancelAppointment,
    generateBill,
    updateBill,
    getBillByAppointmentId,
    getAppointmentsByStatus
}; 

