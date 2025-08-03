const { Doctor } = require('../models/admin');

// Middleware to check if doctor has access to a specific patient
const checkDoctorPatientAccess = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_Id || req.user.Doctor_Id;
        const patientId = req.params.patientId || req.body.Patient_Id || req.body.patient_id;
        
        if (!doctorId) {
            return res.status(401).json({
                success: false,
                error: 'Doctor ID not found in token'
            });
        }

        if (!patientId) {
            return res.status(400).json({
                success: false,
                error: 'Patient ID is required'
            });
        }

        // Get doctor's assigned patients
        const doctor = await Doctor.findOne({ Doctor_Id: doctorId });
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                error: 'Doctor not found'
            });
        }

        // Check if patient is assigned to this doctor
        if (!doctor.assigned_patients.includes(patientId)) {
            return res.status(403).json({
                success: false,
                error: 'Access denied: Patient not assigned to this doctor'
            });
        }

        // Add patient ID to request for use in controllers
        req.verifiedPatientId = patientId;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error checking doctor-patient access'
        });
    }
};

// Middleware to check if doctor has access to an appointment (via patient)
const checkDoctorAppointmentAccess = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_Id || req.user.Doctor_Id;
        const appointmentId = req.params.appointmentId || req.body.Appointment_Id || req.body.appointment_id;
        
        if (!doctorId) {
            return res.status(401).json({
                success: false,
                error: 'Doctor ID not found in token'
            });
        }

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                error: 'Appointment ID is required'
            });
        }

        // Get appointment to find patient
        const { Appointment } = require('../models/receptionist');
        const appointment = await Appointment.findOne({ App_Id: appointmentId });
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        // Get doctor's assigned patients
        const doctor = await Doctor.findOne({ Doctor_Id: doctorId });
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                error: 'Doctor not found'
            });
        }

        // Check if patient is assigned to this doctor
        if (!doctor.assigned_patients.includes(appointment.patient_id)) {
            return res.status(403).json({
                success: false,
                error: 'Access denied: Patient not assigned to this doctor'
            });
        }

        // Add appointment and patient IDs to request for use in controllers
        req.verifiedAppointmentId = appointmentId;
        req.verifiedPatientId = appointment.patient_id;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error checking doctor-appointment access'
        });
    }
};

// Middleware to filter doctor's own data only
const filterDoctorOwnData = async (req, res, next) => {
    try {
        const doctorId = req.user.doctor_Id || req.user.Doctor_Id;
        
        if (!doctorId) {
            return res.status(401).json({
                success: false,
                error: 'Doctor ID not found in token'
            });
        }

        // Add doctor ID to request for filtering in controllers
        req.verifiedDoctorId = doctorId;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error setting doctor filter'
        });
    }
};

module.exports = {
    checkDoctorPatientAccess,
    checkDoctorAppointmentAccess,
    filterDoctorOwnData
}; 