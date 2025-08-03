const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Staff, Doctor } = require('../models/admin');
const { Patient } = require('../models/receptionist');
const { LabTest } = require('../models/labtech');
const { Medicine } = require('../models/pharmacist');

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'pass123';

// Generate JWT Token
const generateToken = (userId, role, userData) => {
    return jwt.sign(
        { 
            userId, 
            role, 
            username: userData.username || userData.Staff_Id || userData.Doctor_Id,
            name: userData.name 
        },
        JWT_SECRET,
        { expiresIn: '3h' }
    );
};

// Administrator Login
exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check admin credentials
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const token = generateToken('admin', 'Administrator', { username, name: 'Administrator' });
            
            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: 'admin',
                    name: 'Administrator',
                    username: 'admin',
                    role: 'Administrator'
                }
            });
        } else {
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Receptionist Login
exports.receptionistLogin = async (req, res) => {
    try {
        const { receptionist_Id, password } = req.body;
        
        if (!receptionist_Id || !password) {
            return res.status(400).json({ error: 'Receptionist ID and password are required' });
        }

        const staff = await Staff.findOne({ 
            Staff_Id: receptionist_Id, 
            role: 'Receptionist', 
            isActive: true 
        });

        if (!staff) {
            return res.status(401).json({ error: 'Invalid credentials or inactive account' });
        }

        const isPasswordValid = await bcrypt.compare(password, staff.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(staff._id, 'Receptionist', staff);
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: staff._id,
                name: staff.name,
                receptionist_Id: staff.Staff_Id,
                role: 'Receptionist'
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Doctor Login
exports.doctorLogin = async (req, res) => {
    try {
        const { doctor_Id, password } = req.body;
        
        if (!doctor_Id || !password) {
            return res.status(400).json({ error: 'Doctor ID and password are required' });
        }

        const doctor = await Doctor.findOne({ Doctor_Id: doctor_Id, isActive: true });

        if (!doctor) {
            return res.status(401).json({ error: 'Invalid credentials or inactive account' });
        }

        const isPasswordValid = await bcrypt.compare(password, doctor.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(doctor._id, 'Doctor', doctor);
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: doctor._id,
                name: doctor.name,
                doctor_Id: doctor.Doctor_Id,
                role: 'Doctor',
                specialization: doctor.specialization
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lab Technician Login
exports.labtechLogin = async (req, res) => {
    try {
        const { labtech_Id, password } = req.body;
        
        if (!labtech_Id || !password) {
            return res.status(400).json({ error: 'Lab Technician ID and password are required' });
        }

        const staff = await Staff.findOne({ 
            Staff_Id: labtech_Id, 
            role: 'Lab Technician', 
            isActive: true 
        });

        if (!staff) {
            return res.status(401).json({ error: 'Invalid credentials or inactive account' });
        }

        const isPasswordValid = await bcrypt.compare(password, staff.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(staff._id, 'Lab Technician', staff);
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: staff._id,
                name: staff.name,
                labtech_Id: staff.Staff_Id,
                role: 'Lab Technician'
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Pharmacist Login
exports.pharmacistLogin = async (req, res) => {
    try {
        const { pharmacist_Id, password } = req.body;
        
        if (!pharmacist_Id || !password) {
            return res.status(400).json({ error: 'Pharmacist ID and password are required' });
        }

        const staff = await Staff.findOne({ 
            Staff_Id: pharmacist_Id, 
            role: 'Pharmacist', 
            isActive: true 
        });

        if (!staff) {
            return res.status(401).json({ error: 'Invalid credentials or inactive account' });
        }

        const isPasswordValid = await bcrypt.compare(password, staff.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(staff._id, 'Pharmacist', staff);
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: staff._id,
                name: staff.name,
                pharmacist_Id: staff.Staff_Id,
                role: 'Pharmacist'
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to check role permissions
exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        
        next();
    };
}; 