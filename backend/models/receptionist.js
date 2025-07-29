const mongoose = require('mongoose');

const PatientSchema = new Schema({
    name: { type: String, required: true },
    dob: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    Blood_group : {type:String,required:true},
    email: { type: String, unique: true },
    phone: String,
    address: String,
    status: { type: String, enum: ['active', 'inactive'], required: true },
    date_registered: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports=mongoose.model('patient',PatientSchema);

const AppointmentSchema = new Schema({
    patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor_id: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    scheduled_date: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], required: true },
    created_by_staff: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    notes: String
}, { timestamps: true });

module.exports=mongoose.model('Appointment',AppointmentSchema);

const ConsultationNoteSchema = new Schema({
    appointment_id: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    doctor_id: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    notes: String
}, { timestamps: true });

module.exports=mongoose.model('ConsultationBill',ConsultationNoteSchema);

const BillingSchema = new Schema({
    appointment_id: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['unpaid', 'paid', 'cancelled'], required: true }
}, { timestamps: true });

module.exports=mongoose.model('Billing',BillingSchema);