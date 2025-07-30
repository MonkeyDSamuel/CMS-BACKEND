const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    Blood_group: { type: String, required: true },
    email: { type: String, unique: true },
    phone: String,
    address: String,
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    date_registered: { type: Date, default: Date.now }
}, { timestamps: true });

const AppointmentSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    scheduled_date: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], required: true },
    created_by_staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    notes: String
}, { timestamps: true });

const ConsultationNoteSchema = new mongoose.Schema({
    appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    notes: String
}, { timestamps: true });

const BillingSchema = new mongoose.Schema({
    appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['unpaid', 'paid', 'cancelled'], required: true }
}, { timestamps: true });

// Create models
const Patient = mongoose.model('Patient', PatientSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);
const ConsultationNote = mongoose.model('ConsultationNote', ConsultationNoteSchema);
const Billing = mongoose.model('Billing', BillingSchema);

// Export all models
module.exports = {
    Patient,
    Appointment,
    ConsultationNote,
    Billing
};