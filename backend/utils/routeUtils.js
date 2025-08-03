/**
 * Centralized route utilities to eliminate redundancy
 */
const { verifyToken, checkRole } = require('../login/auth');

// Predefined middleware combinations
const routeMiddleware = {
    // Authentication only
    auth: [verifyToken],
    
    // Receptionist routes
    receptionist: [verifyToken, checkRole(['Receptionist', 'Administrator'])],
    
    // Doctor routes
    doctor: [verifyToken, checkRole(['Doctor', 'Administrator'])],
    
    // Lab Technician routes
    labtech: [verifyToken, checkRole(['Lab Technician', 'Administrator'])],
    
    // Pharmacist routes
    pharmacist: [verifyToken, checkRole(['Pharmacist', 'Administrator'])],
    
    // Admin only routes
    admin: [verifyToken, checkRole(['Administrator'])],
    
    // Doctor with patient access control
    doctorWithAccess: (req, res, next) => {
        verifyToken(req, res, () => {
            checkRole(['Doctor', 'Administrator'])(req, res, () => {
                const { checkDoctorPatientAccess, checkDoctorAppointmentAccess } = require('../middleware/doctorAccess');
                // Apply appropriate access control based on route
                if (req.path.includes('/patient/')) {
                    checkDoctorPatientAccess(req, res, next);
                } else if (req.path.includes('/appointment/')) {
                    checkDoctorAppointmentAccess(req, res, next);
                } else {
                    next();
                }
            });
        });
    }
};

// Route builder utility
const buildRoute = (router, method, path, middleware, controller) => {
    if (Array.isArray(middleware)) {
        router[method](path, ...middleware, controller);
    } else {
        router[method](path, middleware, controller);
    }
};

// CRUD route builder
const buildCrudRoutes = (router, basePath, controller, middleware, options = {}) => {
    const {
        create = 'create',
        read = 'getById',
        update = 'update',
        delete: deleteMethod = 'delete',
        list = 'listAll',
        deactivate = 'deactivate',
        customRoutes = []
    } = options;
    
    // Standard CRUD routes
    if (controller[create]) {
        buildRoute(router, 'post', basePath, middleware, controller[create]);
    }
    
    if (controller[list]) {
        buildRoute(router, 'get', basePath, middleware, controller[list]);
    }
    
    if (controller[read]) {
        buildRoute(router, 'get', `${basePath}/:id`, middleware, controller[read]);
    }
    
    if (controller[update]) {
        buildRoute(router, 'put', `${basePath}/:id`, middleware, controller[update]);
    }
    
    if (controller[deleteMethod]) {
        buildRoute(router, 'delete', `${basePath}/:id`, middleware, controller[deleteMethod]);
    }
    
    if (controller[deactivate]) {
        buildRoute(router, 'patch', `${basePath}/:id/deactivate`, middleware, controller[deactivate]);
    }
    
    // Custom routes
    customRoutes.forEach(route => {
        buildRoute(router, route.method, route.path, route.middleware || middleware, route.controller);
    });
};

module.exports = {
    routeMiddleware,
    buildRoute,
    buildCrudRoutes
}; 