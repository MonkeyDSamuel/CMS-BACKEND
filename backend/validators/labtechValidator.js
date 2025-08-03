const { body, validationResult } = require('express-validator');

// Validation for LabTest creation and update
const validateLabTest = [
  body('name')
    .notEmpty().withMessage('Lab Test name is required')
    .isString().withMessage('Lab Test name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Lab Test name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  body('min_reading')
    .notEmpty().withMessage('Minimum reading is required')
    .isNumeric().withMessage('Minimum reading must be a number'),
  body('max_reading')
    .notEmpty().withMessage('Maximum reading is required')
    .isNumeric().withMessage('Maximum reading must be a number')
    .custom((value, { req }) => {
      if (parseFloat(value) <= parseFloat(req.body.min_reading)) {
        throw new Error('Maximum reading must be greater than minimum reading');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['available', 'unavailable']).withMessage('Status must be either available or unavailable')
];

// Validation for LabTestResult creation and update
const validateLabTestResult = [
  body('lab_test_id')
    .notEmpty().withMessage('Lab Test ID is required')
    .isString().withMessage('Lab Test ID must be a string'),
  body('app_id')
    .notEmpty().withMessage('Appointment ID is required')
    .isString().withMessage('Appointment ID must be a string'),
  body('doc_id')
    .notEmpty().withMessage('Doctor ID is required')
    .isString().withMessage('Doctor ID must be a string'),
  body('result_notes')
    .optional()
    .isString().withMessage('Result notes must be a string')
    .isLength({ max: 1000 }).withMessage('Result notes must not exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'completed', 'cancelled']).withMessage('Status must be pending, completed, or cancelled')
];

// Middleware to run validation and return errors
const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateLabTest,
  validateLabTestResult,
  runValidation
};