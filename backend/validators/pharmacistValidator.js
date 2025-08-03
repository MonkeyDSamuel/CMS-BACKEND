const { body, validationResult } = require('express-validator');

const validateMedicine = [
  body('name')
    .notEmpty().withMessage('Medicine name is required')
    .isString().withMessage('Medicine name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Medicine name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isNumeric().withMessage('Quantity must be a number')
    .isFloat({ min: 0 }).withMessage('Quantity must be a non-negative number'),
  
  body('price_per_unit')
    .notEmpty().withMessage('Price per unit is required')
    .isNumeric().withMessage('Price per unit must be a number')
    .isFloat({ min: 0 }).withMessage('Price per unit must be a non-negative number'),
  
  body('status')
    .optional()
    .isIn(['available', 'unavailable']).withMessage('Status must be either available or unavailable')
];

const validateMedicineUpdate = [
  body('name')
    .optional()
    .isString().withMessage('Medicine name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Medicine name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('quantity')
    .optional()
    .isNumeric().withMessage('Quantity must be a number')
    .isFloat({ min: 0 }).withMessage('Quantity must be a non-negative number'),
  
  body('price_per_unit')
    .optional()
    .isNumeric().withMessage('Price per unit must be a number')
    .isFloat({ min: 0 }).withMessage('Price per unit must be a non-negative number'),
  
  body('status')
    .optional()
    .isIn(['available', 'unavailable']).withMessage('Status must be either available or unavailable')
];

const validateQuantityUpdate = [
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isNumeric().withMessage('Quantity must be a number')
    .isFloat({ min: 0 }).withMessage('Quantity must be a non-negative number')
];

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
  validateMedicine,
  validateMedicineUpdate,
  validateQuantityUpdate,
  runValidation
};
