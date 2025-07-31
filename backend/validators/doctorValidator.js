const { body, param, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// Consultation Note Validators
const validateAddConsultationNote = [
  body('Appointment_Id')
    .notEmpty()
    .withMessage('Appointment ID is required')
    .isString()
    .withMessage('Appointment ID must be a string')
    .trim(),
  
  body('Doctor_Id')
    .notEmpty()
    .withMessage('Doctor ID is required')
    .isString()
    .withMessage('Doctor ID must be a string')
    .trim(),
  
  body('Notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  handleValidationErrors
];

const validateUpdateConsultationNote = [
  param('consultationId')
    .notEmpty()
    .withMessage('Consultation ID is required')
    .isString()
    .withMessage('Consultation ID must be a string')
    .trim(),
  
  body('Appointment_Id')
    .optional()
    .isString()
    .withMessage('Appointment ID must be a string')
    .trim(),
  
  body('Doctor_Id')
    .optional()
    .isString()
    .withMessage('Doctor ID must be a string')
    .trim(),
  
  body('Notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  handleValidationErrors
];

const validateConsultationId = [
  param('consultationId')
    .notEmpty()
    .withMessage('Consultation ID is required')
    .isString()
    .withMessage('Consultation ID must be a string')
    .trim(),
  
  handleValidationErrors
];

const validateAppointmentId = [
  param('appointmentId')
    .notEmpty()
    .withMessage('Appointment ID is required')
    .isString()
    .withMessage('Appointment ID must be a string')
    .trim(),
  
  handleValidationErrors
];

const validateDoctorId = [
  param('doctorId')
    .notEmpty()
    .withMessage('Doctor ID is required')
    .isString()
    .withMessage('Doctor ID must be a string')
    .trim(),
  
  handleValidationErrors
];

const validatePatientId = [
  param('patientId')
    .notEmpty()
    .withMessage('Patient ID is required')
    .isString()
    .withMessage('Patient ID must be a string')
    .trim(),
  
  handleValidationErrors
];

// Medicine Prescription Validators
const validateCreateMedicinePrescription = [
  body('Appointment_Id')
    .notEmpty()
    .withMessage('Appointment ID is required')
    .isString()
    .withMessage('Appointment ID must be a string')
    .trim(),
  
  body('Doctor_Id')
    .notEmpty()
    .withMessage('Doctor ID is required')
    .isString()
    .withMessage('Doctor ID must be a string')
    .trim(),
  
  body('Medicine_Id')
    .isArray({ min: 1 })
    .withMessage('At least one medicine ID is required')
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error('Medicine_Id must be an array');
      }
      if (value.length === 0) {
        throw new Error('At least one medicine ID is required');
      }
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] !== 'string' || value[i].trim() === '') {
          throw new Error('All medicine IDs must be non-empty strings');
        }
      }
      return true;
    }),
  
  body('Notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  handleValidationErrors
];

const validateUpdateMedicinePrescription = [
  param('prescriptionId')
    .notEmpty()
    .withMessage('Prescription ID is required')
    .isString()
    .withMessage('Prescription ID must be a string')
    .trim(),
  
  body('Appointment_Id')
    .optional()
    .isString()
    .withMessage('Appointment ID must be a string')
    .trim(),
  
  body('Doctor_Id')
    .optional()
    .isString()
    .withMessage('Doctor ID must be a string')
    .trim(),
  
  body('Medicine_Id')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one medicine ID is required')
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error('Medicine_Id must be an array');
      }
      if (value.length === 0) {
        throw new Error('At least one medicine ID is required');
      }
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] !== 'string' || value[i].trim() === '') {
          throw new Error('All medicine IDs must be non-empty strings');
        }
      }
      return true;
    }),
  
  body('Notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  handleValidationErrors
];

const validatePrescriptionId = [
  param('prescriptionId')
    .notEmpty()
    .withMessage('Prescription ID is required')
    .isString()
    .withMessage('Prescription ID must be a string')
    .trim(),
  
  handleValidationErrors
];

// Lab Test Prescription Validators
const validateCreateLabTestPrescription = [
  body('Appointment_Id')
    .notEmpty()
    .withMessage('Appointment ID is required')
    .isString()
    .withMessage('Appointment ID must be a string')
    .trim(),
  
  body('Doctor_Id')
    .notEmpty()
    .withMessage('Doctor ID is required')
    .isString()
    .withMessage('Doctor ID must be a string')
    .trim(),
  
  body('Labtest_Id')
    .isArray({ min: 1 })
    .withMessage('At least one lab test ID is required')
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error('Labtest_Id must be an array');
      }
      if (value.length === 0) {
        throw new Error('At least one lab test ID is required');
      }
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] !== 'string' || value[i].trim() === '') {
          throw new Error('All lab test IDs must be non-empty strings');
        }
      }
      return true;
    }),
  
  body('Notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  handleValidationErrors
];

const validateUpdateLabTestPrescription = [
  param('prescriptionId')
    .notEmpty()
    .withMessage('Lab Test Prescription ID is required')
    .isString()
    .withMessage('Lab Test Prescription ID must be a string')
    .trim(),
  
  body('Appointment_Id')
    .optional()
    .isString()
    .withMessage('Appointment ID must be a string')
    .trim(),
  
  body('Doctor_Id')
    .optional()
    .isString()
    .withMessage('Doctor ID must be a string')
    .trim(),
  
  body('Labtest_Id')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one lab test ID is required')
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error('Labtest_Id must be an array');
      }
      if (value.length === 0) {
        throw new Error('At least one lab test ID is required');
      }
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] !== 'string' || value[i].trim() === '') {
          throw new Error('All lab test IDs must be non-empty strings');
        }
      }
      return true;
    }),
  
  body('Notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  handleValidationErrors
];

module.exports = {
  // Consultation validators
  validateAddConsultationNote,
  validateUpdateConsultationNote,
  validateConsultationId,
  validateAppointmentId,
  validateDoctorId,
  validatePatientId,
  
  // Medicine prescription validators
  validateCreateMedicinePrescription,
  validateUpdateMedicinePrescription,
  validatePrescriptionId,
  
  // Lab test prescription validators
  validateCreateLabTestPrescription,
  validateUpdateLabTestPrescription
};
