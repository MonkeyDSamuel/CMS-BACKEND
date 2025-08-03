/**
 * Centralized validation utilities to eliminate redundancy
 */
const { body, param } = require('express-validator');

// Common validation rules
const commonValidations = {
    // String validations
    requiredString: (field, minLength = 2, maxLength = 100) => 
        body(field)
            .notEmpty().withMessage(`${field} is required`)
            .isString().withMessage(`${field} must be a string`)
            .isLength({ min: minLength, max: maxLength })
            .withMessage(`${field} must be between ${minLength} and ${maxLength} characters`),
    
    optionalString: (field, maxLength = 500) => 
        body(field)
            .optional()
            .isString().withMessage(`${field} must be a string`)
            .isLength({ max: maxLength })
            .withMessage(`${field} must not exceed ${maxLength} characters`),
    
    // Number validations
    requiredNumber: (field, min = 0) => 
        body(field)
            .notEmpty().withMessage(`${field} is required`)
            .isNumeric().withMessage(`${field} must be a number`)
            .isFloat({ min }).withMessage(`${field} must be a non-negative number`),
    
    optionalNumber: (field, min = 0) => 
        body(field)
            .optional()
            .isNumeric().withMessage(`${field} must be a number`)
            .isFloat({ min }).withMessage(`${field} must be a non-negative number`),
    
    // Email validation
    email: (field = 'email') => 
        body(field)
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Email must be a valid email address'),
    
    // Date validation
    date: (field) => 
        body(field)
            .notEmpty().withMessage(`${field} is required`)
            .isISO8601().withMessage(`${field} must be a valid date`),
    
    // Enum validation
    enum: (field, values, fieldName = field) => 
        body(field)
            .notEmpty().withMessage(`${fieldName} is required`)
            .isIn(values).withMessage(`${fieldName} must be one of: ${values.join(', ')}`),
    
    // ID parameter validation
    idParam: (paramName) => 
        param(paramName)
            .notEmpty().withMessage(`${paramName} is required`)
            .isString().withMessage(`${paramName} must be a string`),
    
    // Array validation
    stringArray: (field) => 
        body(field)
            .isArray().withMessage(`${field} must be an array`)
            .custom((value) => {
                if (!Array.isArray(value)) return false;
                return value.every(item => typeof item === 'string' && item.trim() !== '');
            }).withMessage(`${field} must be an array of non-empty strings`)
};

// Predefined validation sets
const validationSets = {
    // Patient validation
    patient: {
        name: commonValidations.requiredString('name', 2, 50),
        dob: commonValidations.date('dob'),
        gender: commonValidations.enum('gender', ['Male', 'Female', 'Other'], 'Gender'),
        bloodGroup: body('Blood_group').notEmpty().withMessage('Blood group is required'),
        email: commonValidations.email(),
        phone: body('phone')
            .optional()
            .isLength({ min: 10, max: 15 })
            .withMessage('Phone number must be between 10 and 15 characters'),
        address: commonValidations.optionalString('address', 500)
    },
    
    // Appointment validation
    appointment: {
        patientId: body('patient_id')
            .notEmpty().withMessage('Patient ID is required')
            .matches(/^PAT\d+$/).withMessage('Invalid patient ID format. Must be PAT followed by numbers'),
        doctorId: body('doctor_id')
            .notEmpty().withMessage('Doctor ID is required')
            .isString().withMessage('Doctor ID must be a string'),
        scheduledDate: commonValidations.date('scheduled_date'),
        status: commonValidations.enum('status', ['scheduled', 'completed', 'cancelled'], 'Status'),
        notes: commonValidations.optionalString('notes', 1000)
    },
    
    // Medicine validation
    medicine: {
        name: commonValidations.requiredString('name', 2, 100),
        description: commonValidations.optionalString('description', 500),
        quantity: commonValidations.requiredNumber('quantity'),
        pricePerUnit: commonValidations.requiredNumber('price_per_unit'),
        status: commonValidations.enum('status', ['available', 'unavailable'], 'Status')
    },
    
    // Lab Test validation
    labTest: {
        name: commonValidations.requiredString('name', 2, 100),
        description: commonValidations.optionalString('description', 500),
        minReading: commonValidations.requiredNumber('min_reading'),
        maxReading: commonValidations.requiredNumber('max_reading'),
        status: commonValidations.enum('status', ['available', 'unavailable'], 'Status')
    }
};

// Validation result handler
const handleValidationErrors = (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: errors.array() 
        });
    }
    next();
};

module.exports = {
    commonValidations,
    validationSets,
    handleValidationErrors
}; 