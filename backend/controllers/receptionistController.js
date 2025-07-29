const Patient = require('../models/receptionist');
const Appointment = require('../models/receptionist');
const Billing = require('../models/receptionist');


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

// Update Patient Information: PUT /api/patients/{patientId}
const updatePatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const patient = await Patient.findByIdAndUpdate(
            patientId,
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

// Get Patient by ID: GET /api/patients/{patientId}
const getPatientById = async (req, res) => {
    try {
        const { patientId } = req.params;
        const patient = await Patient.findById(patientId);
        
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
        
        let query = { is_active: true };
        
        if (search) {
            query.$or = [
                { first_name: { $regex: search, $options: 'i' } },
                { last_name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        
        const patients = await Patient.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ created_at: -1 });
            
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

// Deactivate Patient: PATCH /api/patients/{patientId}/deactivate
const deactivatePatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const patient = await Patient.findByIdAndUpdate(
            patientId,
            { is_active: false },
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

module.exports = {
    registerPatient,
    updatePatient,
    getPatientById,
    getAllPatients,
    deactivatePatient
}; 


// Schedule Appointment: POST /api/appointments
const scheduleAppointment = async (req, res) => {
    try {
        const appointment = new Appointment({
            ...req.body,
            created_by_staff: req.user.id // Assuming user is authenticated
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

// Update Appointment: PUT /api/appointments/{appointmentId}
const updateAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
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

// Get Appointment by ID: GET /api/appointments/{appointmentId}
const getAppointmentById = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await Appointment.findById(appointmentId)
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

// List Appointments by Date: GET /api/appointments?date={appointmentDate}
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

// Cancel Appointment: PATCH /api/appointments/{appointmentId}/cancel
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
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

const Billing = require('../models/receptionist');
const Appointment = require('../models/receptionist');

// Generate Appointment Bill: POST /api/billing
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

// Update Appointment Bill: PUT /api/billing/{appointmentId}
const updateBill = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const bill = await Billing.findOneAndUpdate(
            { appointment_id: appointmentId },
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

// Get Bill by Appointment ID: GET /api/billing/{appointmentId}
const getBillByAppointmentId = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const bill = await Billing.findOne({ appointment_id: appointmentId })
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

// List Bills by Date Range: GET /api/billing?startDate={startDate}&endDate={endDate}
const getBillsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate, page = 1, limit = 10, status } = req.query;
        
        let query = {};
        
        if (startDate && endDate) {
            query.created_at = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        if (status) {
            query.status = status;
        }
        
        const bills = await Billing.find(query)
            .populate({
                path: 'appointment_id',
                populate: ['patient_id', 'doctor_id']
            })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ created_at: -1 });
            
        const total = await Billing.countDocuments(query);
        
        res.json({
            success: true,
            data: bills,
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
            message: 'Failed to get bills',
            error: error.message
        });
    }
};

// Mark bill as paid
const markBillAsPaid = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const bill = await Billing.findOneAndUpdate(
            { appointment_id: appointmentId },
            { status: 'paid' },
            { new: true }
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
            message: 'Bill marked as paid successfully',
            data: bill
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to mark bill as paid',
            error: error.message
        });
    }
};

module.exports = {
    generateBill,
    updateBill,
    getBillByAppointmentId,
    getBillsByDateRange,
    markBillAsPaid
}; 


// List Appointments by Patient: GET /api/appointments/patient/{patientId}
const getAppointmentsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        const appointments = await Appointment.find({ patient_id: patientId })
            .populate(['patient_id', 'doctor_id'])
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ scheduled_date: -1 });
            
        const total = await Appointment.countDocuments({ patient_id: patientId });
        
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
            message: 'Failed to get patient appointments',
            error: error.message
        });
    }
};

// List Appointments by Doctor: GET /api/appointments/doctor/{doctorId}
const getAppointmentsByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        const appointments = await Appointment.find({ doctor_id: doctorId })
            .populate(['patient_id', 'doctor_id'])
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ scheduled_date: 1 });
            
        const total = await Appointment.countDocuments({ doctor_id: doctorId });
        
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
            message: 'Failed to get doctor appointments',
            error: error.message
        });
    }
};

// Get Appointments with Status: GET /api/appointments?status={status}
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
    scheduleAppointment,
    updateAppointment,
    getAppointmentById,
    getAppointmentsByDate,
    cancelAppointment,
    getAppointmentsByPatient,
    getAppointmentsByDoctor,
    getAppointmentsByStatus
}; 

