/**
 * Centralized error handling utilities to eliminate redundancy
 */

// Standard HTTP response helper
const sendResponse = (res, statusCode, data, message = null) => {
    const response = { ...data };
    if (message) response.message = message;
    return res.status(statusCode).json(response);
};

// Success responses
const sendSuccess = (res, data, message = 'Success') => {
    return sendResponse(res, 200, data, message);
};

const sendCreated = (res, data, message = 'Created successfully') => {
    return sendResponse(res, 201, data, message);
};

// Error responses
const sendError = (res, statusCode, error, message = null) => {
    const errorResponse = { error: message || error.message || 'An error occurred' };
    if (process.env.NODE_ENV === 'development') {
        errorResponse.details = error.stack;
    }
    return sendResponse(res, statusCode, errorResponse);
};

const sendBadRequest = (res, error, message = null) => {
    return sendError(res, 400, error, message);
};

const sendNotFound = (res, error, message = null) => {
    return sendError(res, 404, error, message);
};

const sendUnauthorized = (res, error, message = null) => {
    return sendError(res, 401, error, message);
};

const sendForbidden = (res, error, message = null) => {
    return sendError(res, 403, error, message);
};

const sendInternalError = (res, error, message = null) => {
    return sendError(res, 500, error, message);
};

// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.name === 'ValidationError') {
        return sendBadRequest(res, err, 'Validation failed');
    }
    
    if (err.name === 'CastError') {
        return sendBadRequest(res, err, 'Invalid ID format');
    }
    
    if (err.code === 11000) {
        return sendBadRequest(res, err, 'Duplicate field value');
    }
    
    return sendInternalError(res, err);
};

module.exports = {
    sendResponse,
    sendSuccess,
    sendCreated,
    sendError,
    sendBadRequest,
    sendNotFound,
    sendUnauthorized,
    sendForbidden,
    sendInternalError,
    asyncHandler,
    globalErrorHandler
}; 