const mongoose = require('mongoose');

// Auto-increment counter schema
const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', CounterSchema);

// Function to get next sequence
const getNextSequence = async (name) => {
    const counter = await Counter.findByIdAndUpdate(
        name,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
};

// Function to generate alphanumeric patient ID
const generatePatientId = async () => {
    const sequence = await getNextSequence('patient');
    const paddedSequence = sequence.toString().padStart(4, '0');
    return `PAT${paddedSequence}`;
};

// Function to generate alphanumeric appointment ID
const generateAppointmentId = async () => {
    const sequence = await getNextSequence('appointment');
    const paddedSequence = sequence.toString().padStart(4, '0');
    return `APP${paddedSequence}`;
};

// Function to generate alphanumeric bill ID
const generateBillId = async () => {
    const sequence = await getNextSequence('billing');
    const paddedSequence = sequence.toString().padStart(4, '0');
    return `BIL${paddedSequence}`;
};

const PatientSchema = new mongoose.Schema({
    Pat_Id: { type: String, unique: true },
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

// Pre-save middleware to auto-generate Pat_Id
PatientSchema.pre('save', async function(next) {
    if (this.isNew && !this.Pat_Id) {
        this.Pat_Id = await generatePatientId();
    }
    next();
});

const AppointmentSchema = new mongoose.Schema({
    App_Id: { type: String, unique: true },
    patient_id: { type: String, required: true },
    doctor_id: { type: Number, required: true },
    scheduled_date: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], required: true },
    created_by_staff: { type: Number, required: true },
    notes: String
}, { timestamps: true });

// Pre-save middleware to auto-generate App_Id
AppointmentSchema.pre('save', async function(next) {
    if (this.isNew && !this.App_Id) {
        this.App_Id = await generateAppointmentId();
    }
    next();
});

const BillingSchema = new mongoose.Schema({
    Bill_Id: { type: String, unique: true },
    appointment_id: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['unpaid', 'paid', 'cancelled'], required: true }
}, { timestamps: true });

// Pre-save middleware to auto-generate Bill_Id
BillingSchema.pre('save', async function(next) {
    if (this.isNew && !this.Bill_Id) {
        this.Bill_Id = await generateBillId();
    }
    next();
});

// Create models
const Patient = mongoose.model('Patient', PatientSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);
const Billing = mongoose.model('Billing', BillingSchema);

// Export all models
module.exports = {
    Patient,
    Appointment,
    Billing
};