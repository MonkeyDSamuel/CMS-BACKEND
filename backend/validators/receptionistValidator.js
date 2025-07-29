const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Patient validators
const validatePatientRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('date_of_birth')
        .isISO8601()
        .withMessage('Date of birth must be a valid date'),
    body('gender')
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Email must be a valid email address'),
    body('phone')
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage('Phone number must be between 10 and 15 characters'),
    body('address.street').optional().trim(),
    body('address.city').optional().trim(),
    body('address.state').optional().trim(),
    body('address.zip_code').optional().trim(),
    body('address.country').optional().trim(),
    body('emergency_contact.name').optional().trim(),
    body('emergency_contact.relationship').optional().trim(),
    body('emergency_contact.phone').optional().trim(),
    body('medical_history').optional().isArray(),
    body('allergies').optional().isArray(),
    handleValidationErrors
];

const validatePatientUpdate = [
    param('patientId')
        .isMongoId()
        .withMessage('Invalid patient ID'),
    body('first_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('last_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('date_of_birth')
        .optional()
        .isISO8601()
        .withMessage('Date of birth must be a valid date'),
    body('gender')
        .optional()
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Email must be a valid email address'),
    body('phone')
        .optional()
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage('Phone number must be between 10 and 15 characters'),
    handleValidationErrors
];

const validatePatientId = [
    param('patientId')
        .isMongoId()
        .withMessage('Invalid patient ID'),
    handleValidationErrors
];

const validatePatientList = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('search')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Search term must not be empty'),
    handleValidationErrors
];

// Appointment validators
const validateAppointmentSchedule = [
    body('patient_id')
        .isMongoId()
        .withMessage('Invalid patient ID'),
    body('doctor_id')
        .isMongoId()
        .withMessage('Invalid doctor ID'),
    body('scheduled_date')
        .isISO8601()
        .withMessage('Scheduled date must be a valid date'),
    body('status')
        .optional()
        .isIn(['scheduled', 'completed', 'cancelled'])
        .withMessage('Status must be scheduled, completed, or cancelled'),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Notes must not exceed 1000 characters'),
    handleValidationErrors
];

const validateAppointmentUpdate = [
    param('appointmentId')
        .isMongoId()
        .withMessage('Invalid appointment ID'),
    body('patient_id')
        .optional()
        .isMongoId()
        .withMessage('Invalid patient ID'),
    body('doctor_id')
        .optional()
        .isMongoId()
        .withMessage('Invalid doctor ID'),
    body('scheduled_date')
        .optional()
        .isISO8601()
        .withMessage('Scheduled date must be a valid date'),
    body('status')
        .optional()
        .isIn(['scheduled', 'completed', 'cancelled'])
        .withMessage('Status must be scheduled, completed, or cancelled'),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Notes must not exceed 1000 characters'),
    handleValidationErrors
];

const validateAppointmentId = [
    param('appointmentId')
        .isMongoId()
        .withMessage('Invalid appointment ID'),
    handleValidationErrors
];

const validateAppointmentList = [
    query('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid date'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('status')
        .optional()
        .isIn(['scheduled', 'completed', 'cancelled'])
        .withMessage('Status must be scheduled, completed, or cancelled'),
    handleValidationErrors
];

// Billing validators
const validateBillGeneration = [
    body('appointment_id')
        .isMongoId()
        .withMessage('Invalid appointment ID'),
    body('amount')
        .isFloat({ min: 0 })
        .withMessage('Amount must be a positive number'),
    handleValidationErrors
];

const validateBillUpdate = [
    param('appointmentId')
        .isMongoId()
        .withMessage('Invalid appointment ID'),
    body('amount')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Amount must be a positive number'),
    body('status')
        .optional()
        .isIn(['unpaid', 'paid', 'cancelled'])
        .withMessage('Status must be unpaid, paid, or cancelled'),
    handleValidationErrors
];

const validateBillList = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('status')
        .optional()
        .isIn(['unpaid', 'paid', 'cancelled'])
        .withMessage('Status must be unpaid, paid, or cancelled'),
    handleValidationErrors
];

module.exports = {
    // Patient validators
    validatePatientRegistration,
    validatePatientUpdate,
    validatePatientId,
    validatePatientList,
    
    // Appointment validators
    validateAppointmentSchedule,
    validateAppointmentUpdate,
    validateAppointmentId,
    validateAppointmentList,
    
    // Billing validators
    validateBillGeneration,
    validateBillUpdate,
    validateBillList,
    
    // General validator
    handleValidationErrors
}; 