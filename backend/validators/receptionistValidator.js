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
        .withMessage('Name must be between 2 and 50 characters'),
    body('dob')
        .isISO8601()
        .withMessage('Date of birth must be a valid date'),
    body('gender')
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),
    body('Blood_group')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Blood group is required'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Email must be a valid email address'),
    body('phone')
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage('Phone number must be between 10 and 15 characters'),
    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Address must not exceed 500 characters'),
    handleValidationErrors
];

const validatePatientUpdate = [
    param('id')
        .matches(/^PAT\d+$/)
        .withMessage('Invalid patient ID format. Must be PAT followed by numbers (e.g., PAT123)'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('dob')
        .optional()
        .isISO8601()
        .withMessage('Date of birth must be a valid date'),
    body('gender')
        .optional()
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),
    body('Blood_group')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Blood group is required'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Email must be a valid email address'),
    body('phone')
        .optional()
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage('Phone number must be between 10 and 15 characters'),
    body('address')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Address must not exceed 500 characters'),
    handleValidationErrors
];

const validatePatientId = [
    param('id')
        .matches(/^PAT\d+$/)
        .withMessage('Invalid patient ID format. Must be PAT followed by numbers (e.g., PAT123)'),
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
        .matches(/^PAT\d+$/)
        .withMessage('Invalid patient ID format. Must be PAT followed by numbers (e.g., PAT123)'),
    body('doctor_id')
        .isInt({ min: 1 })
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
    param('id')
        .matches(/^APP\d+$/)
        .withMessage('Invalid appointment ID format. Must be APP followed by numbers (e.g., APP123)'),
    body('patient_id')
        .optional()
        .matches(/^PAT\d+$/)
        .withMessage('Invalid patient ID format. Must be PAT followed by numbers (e.g., PAT123)'),
    body('doctor_id')
        .optional()
        .isInt({ min: 1 })
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
    param('id')
        .matches(/^APP\d+$/)
        .withMessage('Invalid appointment ID format. Must be APP followed by numbers (e.g., APP123)'),
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
        .matches(/^APP\d+$/)
        .withMessage('Invalid appointment ID format. Must be APP followed by numbers (e.g., APP123)'),
    body('amount')
        .isFloat({ min: 0 })
        .withMessage('Amount must be a positive number'),
    handleValidationErrors
];

const validateBillUpdate = [
    param('id')
        .matches(/^BIL\d+$/)
        .withMessage('Invalid bill ID format. Must be BIL followed by numbers (e.g., BIL123)'),
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