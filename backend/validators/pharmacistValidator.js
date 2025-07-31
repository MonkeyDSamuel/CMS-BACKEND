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
  body('status')
    .optional()
    .isIn(['available', 'unavailable']).withMessage('Status must be either available or unavailable')
];

const validateInventory = [
  body('inventory_id')
    .notEmpty().withMessage('Inventory ID is required')
    .isString().withMessage('Inventory ID must be a string'),
  body('medicine_id')
    .notEmpty().withMessage('Medicine ID is required')
    .isString().withMessage('Medicine ID must be a string'),
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
  validateInventory,
  runValidation
};
