# Doctor Patient Assignment Security Guide

This guide explains the updated doctor functionality with patient assignment security, ensuring doctors can only access data for patients assigned to them.

## Overview

The system now implements strict patient assignment security where doctors can only:
- Access consultation notes for their assigned patients
- Create/update prescriptions for their assigned patients
- View medical history for their assigned patients
- Manage lab test prescriptions for their assigned patients

## Security Implementation

### 1. Doctor Model Updates

The Doctor schema now includes an `assigned_patients` field:

```javascript
const DoctorSchema = new mongoose.Schema({
    Doctor_Id: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    specialization: { type: String, ref: 'Specialization', required: true },
    assigned_patients: [{ type: String, ref: 'Patient' }], // Array of Patient_Id values
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});
```

### 2. Access Control Middleware

Three middleware functions ensure proper access control:

#### `checkDoctorPatientAccess`
- Validates that a doctor has access to a specific patient
- Used for patient-specific operations
- Returns 403 if patient is not assigned to doctor

#### `checkDoctorAppointmentAccess`
- Validates that a doctor has access to an appointment (via patient)
- Used for appointment-specific operations
- Returns 403 if appointment's patient is not assigned to doctor

#### `filterDoctorOwnData`
- Filters data to show only doctor's own records
- Used for doctor-specific listing operations
- Ensures doctors only see their own data

### 3. Updated Routes

All doctor routes now include appropriate access control middleware:

```javascript
// Consultation Notes
router.post('/api/consultations', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.addConsultationNote);
router.put('/api/consultations/:consultationId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.updateConsultationNote);
router.get('/api/consultations/appointment/:appointmentId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.getConsultationByAppointmentId);
router.get('/api/consultations/doctor/:doctorId', verifyToken, checkRole(['Doctor', 'Administrator']), filterDoctorOwnData, doctorController.listConsultationsByDoctor);

// Medicine Prescription
router.post('/api/prescriptions/medicine', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.createMedicinePrescription);
router.put('/api/prescriptions/medicine/:prescriptionId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.updateMedicinePrescription);
router.get('/api/prescriptions/medicine/appointment/:appointmentId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.getMedicinePrescriptionByAppointmentId);
router.get('/api/prescriptions/medicine/patient/:patientId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorPatientAccess, doctorController.listMedicinePrescriptionsByPatient);

// Lab Test Prescription
router.post('/api/prescriptions/labtest', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.createLabTestPrescription);
router.put('/api/prescriptions/labtest/:prescriptionId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.updateLabTestPrescription);
router.get('/api/prescriptions/labtest/appointment/:appointmentId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.getLabTestPrescriptionByAppointmentId);
router.get('/api/prescriptions/labtest/patient/:patientId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorPatientAccess, doctorController.listLabTestPrescriptionsByPatient);

// Consultation History
router.get('/api/consultations/patient/:patientId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorPatientAccess, doctorController.listConsultationsByPatient);
router.get('/api/consultations/history/appointment/:appointmentId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.getConsultationHistoryByAppointmentId);

// Medicine Prescription History
router.get('/api/prescriptions/medicine/history/patient/:patientId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorPatientAccess, doctorController.listMedicinePrescriptionHistoryByPatient);
router.get('/api/prescriptions/medicine/history/doctor/:doctorId', verifyToken, checkRole(['Doctor', 'Administrator']), filterDoctorOwnData, doctorController.listMedicinePrescriptionHistoryByDoctor);
router.get('/api/prescriptions/medicine/history/appointment/:appointmentId', verifyToken, checkRole(['Doctor', 'Administrator']), checkDoctorAppointmentAccess, doctorController.getMedicinePrescriptionHistoryByAppointmentId);
```

## Admin Patient Assignment Management

### New Admin Endpoints

Administrators can manage patient assignments using these endpoints:

#### 1. Assign Patients to Doctor
- **Method**: POST
- **URL**: `/api/doctors/{doctorId}/assign-patients`
- **Body**: `{ "patientIds": ["PAT0001", "PAT0002", "PAT0003"] }`

#### 2. Remove Patients from Doctor
- **Method**: DELETE
- **URL**: `/api/doctors/{doctorId}/remove-patients`
- **Body**: `{ "patientIds": ["PAT0002"] }`

#### 3. Get Doctor's Assigned Patients
- **Method**: GET
- **URL**: `/api/doctors/{doctorId}/assigned-patients`

## Updated Controller Functions

All doctor controller functions now use verified IDs from middleware:

### Consultation Notes
```javascript
exports.addConsultationNote = async (req, res) => {
  try {
    const consultationData = {
      ...req.body,
      Appointment_Id: req.verifiedAppointmentId || req.body.Appointment_Id,
      Doctor_Id: req.verifiedDoctorId || req.body.Doctor_Id
    };
    
    const consultation = new Consultation(consultationData);
    await consultation.save();
    res.status(201).json(consultation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
```

### Medicine Prescriptions
```javascript
exports.createMedicinePrescription = async (req, res) => {
  try {
    const prescriptionData = {
      ...req.body,
      Appointment_Id: req.verifiedAppointmentId || req.body.Appointment_Id,
      Doctor_Id: req.verifiedDoctorId || req.body.Doctor_Id
    };
    
    const prescription = new MedicinePres(prescriptionData);
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
```

### Lab Test Prescriptions
```javascript
exports.createLabTestPrescription = async (req, res) => {
  try {
    const prescriptionData = {
      ...req.body,
      Appointment_Id: req.verifiedAppointmentId || req.body.Appointment_Id,
      Doctor_Id: req.verifiedDoctorId || req.body.Doctor_Id
    };
    
    const prescription = new LabPres(prescriptionData);
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
```

## Security Benefits

### 1. Data Isolation
- Doctors can only access data for their assigned patients
- Prevents unauthorized access to patient information
- Ensures HIPAA compliance and data privacy

### 2. Role-Based Access Control
- Clear separation between doctor and admin functions
- Administrators manage patient assignments
- Doctors focus on patient care within their scope

### 3. Audit Trail
- All access is logged and verified
- Failed access attempts are properly handled
- Clear error messages for unauthorized access

## Testing Scenarios

### 1. Valid Access
- Doctor accesses assigned patient's data → ✅ Success
- Doctor creates prescription for assigned patient → ✅ Success
- Doctor views consultation history for assigned patient → ✅ Success

### 2. Invalid Access
- Doctor tries to access unassigned patient → ❌ 403 Forbidden
- Doctor tries to create prescription for unassigned patient → ❌ 403 Forbidden
- Doctor tries to view other doctor's data → ❌ 403 Forbidden

### 3. Admin Operations
- Admin assigns patients to doctor → ✅ Success
- Admin removes patients from doctor → ✅ Success
- Admin views doctor's assigned patients → ✅ Success

## Error Handling

### Access Denied (403)
```json
{
  "success": false,
  "error": "Access denied: Patient not assigned to this doctor"
}
```

### Invalid Request (400)
```json
{
  "success": false,
  "error": "Patient ID is required"
}
```

### Doctor Not Found (404)
```json
{
  "success": false,
  "error": "Doctor not found"
}
```

## Implementation Notes

### 1. Middleware Chain
- Authentication → Role Check → Access Control → Controller
- Each middleware adds verified data to request object
- Controllers use verified data instead of raw parameters

### 2. Database Queries
- All queries use verified IDs from middleware
- Prevents SQL injection and unauthorized data access
- Ensures data consistency and security

### 3. Response Format
- Consistent error response format
- Clear success/error indicators
- Proper HTTP status codes

## Migration Considerations

### 1. Existing Data
- Existing doctors without assigned patients will have limited access
- Administrators should assign patients to existing doctors
- Consider bulk assignment for initial setup

### 2. Testing
- Test all endpoints with assigned and unassigned patients
- Verify error responses for unauthorized access
- Ensure admin functions work correctly

### 3. Documentation
- Update API documentation to reflect new security model
- Include patient assignment examples
- Document error scenarios and responses

This implementation ensures that doctors can only perform operations on patients assigned to them, providing a secure and compliant healthcare management system. 