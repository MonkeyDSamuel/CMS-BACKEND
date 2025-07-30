const { body, param } = require('express-validator');

// Staff Validation
exports.validateCreateStaff = [
    body('Staff_Id').not().exists().withMessage('Staff_Id is auto-generated and must not be provided'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').isIn(['Pharmacist', 'Receptionist', 'Lab Technician']).withMessage('Role must be Pharmacist, Receptionist, or Lab Technician'),
    body('dob')
        .notEmpty().withMessage('Date of birth is required')
        .isISO8601().withMessage('Date of birth must be a valid date')
        .custom((value) => {
            const dob = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                return age - 1 >= 20 && age - 1 <= 60;
            }
            return age >= 20 && age <= 60;
        }).withMessage('Age must be between 20 and 60 years'),
    body('isActive').optional().isBoolean(),
];

exports.validateUpdateStaff = [
    param('staffId').matches(/^(REC|PHM|LAB)\d{4}$/).withMessage('Valid staffId is required'),
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('role').optional().isIn(['Pharmacist', 'Receptionist', 'Lab Technician']),
    body('dob')
        .optional()
        .isISO8601().withMessage('Date of birth must be a valid date')
        .custom((value) => {
            const dob = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                return age - 1 >= 20 && age - 1 <= 60;
            }
            return age >= 20 && age <= 60;
        }).withMessage('Age must be between 20 and 60 years'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('createdAt').optional().isISO8601().withMessage('Date of birth must be a valid date'),
];

exports.validateStaffId = [
    param('staffId').matches(/^(REC|PHM|LAB)\d{4}$/).withMessage('Valid staffId is required'),
];

// Doctor Validation
exports.validateCreateDoctor = [
    body('Doctor_Id').not().exists().withMessage('Doctor_Id is auto-generated and must not be provided'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('specialization').matches(/^SPC\d{4}$/).withMessage('Valid Specialization_Id is required'),
    body('dob')
        .notEmpty().withMessage('Date of birth is required')
        .isISO8601().withMessage('Date of birth must be a valid date')
        .custom((value) => {
            const dob = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                return age - 1 >= 20 && age - 1 <= 60;
            }
            return age >= 20 && age <= 60;
        }).withMessage('Age must be between 20 and 60 years'),
];

exports.validateUpdateDoctor = [
    param('doctorId').matches(/^DOC\d{4}$/).withMessage('Valid doctorId is required'),
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('specialization').optional().matches(/^SPC\d{4}$/),
    body('dob')
        .optional()
        .isISO8601().withMessage('Date of birth must be a valid date')
        .custom((value) => {
            const dob = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                return age - 1 >= 20 && age - 1 <= 60;
            }
            return age >= 20 && age <= 60;
        }).withMessage('Age must be between 20 and 60 years'),
];

exports.validateDoctorId = [
    param('doctorId').matches(/^DOC\d{4}$/).withMessage('Valid doctorId is required'),
];

// Specialization Validation
exports.validateCreateSpecialization = [
    body('name').notEmpty().withMessage('Specialization name is required'),
];

exports.validateUpdateSpecialization = [
    param('specializationId').matches(/^SPC\d{4}$/).withMessage('Valid specializationId is required'),
    body('name').optional().notEmpty(),
];

exports.validateSpecializationId = [
    param('specializationId').matches(/^SPC\d{4}$/).withMessage('Valid specializationId is required'),
];
