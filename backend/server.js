const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const labtechRoutes = require('./routes/labtechRoutes');
const pharmacistRoutes = require('./routes/pharmacistRoutes');
const receptionistRoutes = require('./routes/receptionistRoutes');

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/labtech', labtechRoutes);
app.use('/api/pharmacist', pharmacistRoutes);
app.use('/api/receptionist', receptionistRoutes);

// Server Start
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});
