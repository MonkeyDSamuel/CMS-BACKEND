const mongoose = require('mongoose');

// Staff Schema
const StaffSchema = new mongoose.Schema({
    Staff_Id: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    dob: { type: Date, required: true },
    role: {
        type: String,
        enum: ['Pharmacist', 'Receptionist', 'Lab Technician'],
        required: true
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});



// Specialization Counter Schema for auto-incrementing Specialization_Id
const SpecializationCounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

// Specialization Schema
const SpecializationSchema = new mongoose.Schema({
    Specialization_Id: { type: String, unique: true},
    name: { type: String, required: true, unique: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

// Doctor Schema
const DoctorSchema = new mongoose.Schema({
    Doctor_Id: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    specialization: { type: String, ref: 'Specialization', required: true }, // references Specialization_Id
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Doctor Counter Schema for auto-incrementing Doctor_Id
const DoctorCounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

// Staff Counter Schema for auto-incrementing Staff_Id based on role
const StaffCounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

// Pre-save middleware to auto-generate Doctor_Id
DoctorSchema.pre('save', async function(next) {
    if (this.isNew && !this.Doctor_Id) {
        try {
            const DoctorCounter = mongoose.model('DoctorCounter');
            const counter = await DoctorCounter.findByIdAndUpdate(
                'doctorId',
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.Doctor_Id = `DOC${counter.seq.toString().padStart(4, '0')}`;
        } catch (error) {
            return next(error);
        }
    }
    this.updatedAt = new Date();
    next();
});

// Pre-save middleware to auto-generate Staff_Id based on role
StaffSchema.pre('save', async function(next) {
    if (this.isNew && !this.Staff_Id) {
        try {
            const StaffCounter = mongoose.model('StaffCounter');
            let prefix;
            
            switch(this.role) {
                case 'Receptionist':
                    prefix = 'REC';
                    break;
                case 'Pharmacist':
                    prefix = 'PHM';
                    break;
                case 'Lab Technician':
                    prefix = 'LAB';
                    break;
                default:
                    return next(new Error('Invalid role'));
            }
            
            const counter = await StaffCounter.findByIdAndUpdate(
                `${prefix.toLowerCase()}Id`,
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.Staff_Id = `${prefix}${counter.seq.toString().padStart(4, '0')}`;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Pre-save middleware to auto-generate Specialization_Id
SpecializationSchema.pre('save', async function(next) {
    if (this.isNew && !this.Specialization_Id) {
        try {
            const SpecializationCounter = mongoose.model('SpecializationCounter');
            const counter = await SpecializationCounter.findByIdAndUpdate(
                'specializationId',
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.Specialization_Id = `SPC${counter.seq.toString().padStart(4, '0')}`;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Staff = mongoose.model('Staff', StaffSchema);
const Specialization = mongoose.model('Specialization', SpecializationSchema);
const SpecializationCounter = mongoose.model('SpecializationCounter', SpecializationCounterSchema);
const Doctor = mongoose.model('Doctor', DoctorSchema);
const DoctorCounter = mongoose.model('DoctorCounter', DoctorCounterSchema);
const StaffCounter = mongoose.model('StaffCounter', StaffCounterSchema);

module.exports = {
    Staff,
    Specialization,
    Doctor,
    DoctorCounter,
    StaffCounter,
    SpecializationCounter
};
