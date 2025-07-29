const { body, param } = require('express-validator');

// Staff Validation
exports.validateCreateStaff = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').notEmpty().withMessage('Role is required'),
];

exports.validateUpdateStaff = [
    param('staffId').isMongoId().withMessage('Valid staffId is required'),
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('role').optional().notEmpty(),
];

exports.validateStaffId = [
    param('staffId').isMongoId().withMessage('Valid staffId is required'),
];

// Role Validation
exports.validateCreateRole = [
    body('name').notEmpty().withMessage('Role name is required'),
];

exports.validateUpdateRole = [
    param('roleId').isMongoId().withMessage('Valid roleId is required'),
    body('name').optional().notEmpty(),
];

exports.validateRoleId = [
    param('roleId').isMongoId().withMessage('Valid roleId is required'),
];

// Doctor Validation
exports.validateCreateDoctor = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
];

exports.validateUpdateDoctor = [
    param('doctorId').isMongoId().withMessage('Valid doctorId is required'),
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
];

exports.validateDoctorId = [
    param('doctorId').isMongoId().withMessage('Valid doctorId is required'),
];

// Specialization Validation
exports.validateCreateSpecialization = [
    body('name').notEmpty().withMessage('Specialization name is required'),
];

exports.validateUpdateSpecialization = [
    param('specializationId').isMongoId().withMessage('Valid specializationId is required'),
    body('name').optional().notEmpty(),
];

exports.validateSpecializationId = [
    param('specializationId').isMongoId().withMessage('Valid specializationId is required'),
];
