const { Patient, Appointment, Billing } = require('../models/receptionist');

// Helper function to populate appointment with patient and doctor data
const populateAppointment = async (appointment) => {
    if (appointment.patient_id) {
        const patient = await Patient.findOne({ Pat_Id: appointment.patient_id });
        appointment.patient = patient;
    }
    // Note: Doctor and Staff data would need to be fetched from their respective models
    return appointment;
};

// Helper function to populate billing with appointment data
const populateBilling = async (billing) => {
    if (billing.appointment_id) {
        const appointment = await Appointment.findOne({ App_Id: billing.appointment_id });
        if (appointment) {
            billing.appointment = await populateAppointment(appointment);
        }
    }
    return billing;
};

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
        const patient = await Patient.findOneAndUpdate(
            { Pat_Id: id },
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
        const patient = await Patient.findOne({ Pat_Id: id });
        
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
                { phone: { $regex: search, $options: 'i' } },
                { Pat_Id: { $regex: search, $options: 'i' } }
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
        const patient = await Patient.findOneAndUpdate(
            { Pat_Id: id },
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
            created_by_staff: req.user?.id || 1 // Assuming user is authenticated
        });
        await appointment.save();
        
        // Manually populate patient data
        const populatedAppointment = await populateAppointment(appointment);
        
        res.status(201).json({
            success: true,
            message: 'Appointment scheduled successfully',
            data: populatedAppointment
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
        const appointment = await Appointment.findOneAndUpdate(
            { App_Id: id },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        // Manually populate patient data
        const populatedAppointment = await populateAppointment(appointment);
        
        res.json({
            success: true,
            message: 'Appointment updated successfully',
            data: populatedAppointment
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
        const appointment = await Appointment.findOne({ App_Id: id });
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        // Manually populate patient data
        const populatedAppointment = await populateAppointment(appointment);
        
        res.json({
            success: true,
            data: populatedAppointment
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
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ scheduled_date: 1 });
            
        // Manually populate patient data for each appointment
        const populatedAppointments = await Promise.all(
            appointments.map(appointment => populateAppointment(appointment))
        );
            
        const total = await Appointment.countDocuments(query);
        
        res.json({
            success: true,
            data: populatedAppointments,
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
        const appointment = await Appointment.findOneAndUpdate(
            { App_Id: id },
            { status: 'cancelled' },
            { new: true }
        );
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        // Manually populate patient data
        const populatedAppointment = await populateAppointment(appointment);
        
        res.json({
            success: true,
            message: 'Appointment cancelled successfully',
            data: populatedAppointment
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
        const appointment = await Appointment.findOne({ App_Id: appointment_id });
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
        const existingBill = await Billing.findOne({ appointment_id: appointment_id });
        if (existingBill) {
            return res.status(400).json({
                success: false,
                message: 'Bill already exists for this appointment'
            });
        }
        
        const bill = new Billing({
            appointment_id: appointment_id,
            amount,
            status: 'unpaid'
        });
        
        await bill.save();
        
        // Manually populate appointment data
        const populatedBill = await populateBilling(bill);
        
        res.status(201).json({
            success: true,
            message: 'Bill generated successfully',
            data: populatedBill
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
        const bill = await Billing.findOneAndUpdate(
            { Bill_Id: id },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }
        
        // Manually populate appointment data
        const populatedBill = await populateBilling(bill);
        
        res.json({
            success: true,
            message: 'Bill updated successfully',
            data: populatedBill
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
        const bill = await Billing.findOne({ appointment_id: id });
        
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }
        
        // Manually populate appointment data
        const populatedBill = await populateBilling(bill);
        
        res.json({
            success: true,
            data: populatedBill
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
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ scheduled_date: 1 });
            
        // Manually populate patient data for each appointment
        const populatedAppointments = await Promise.all(
            appointments.map(appointment => populateAppointment(appointment))
        );
            
        const total = await Appointment.countDocuments(query);
        
        res.json({
            success: true,
            data: populatedAppointments,
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

