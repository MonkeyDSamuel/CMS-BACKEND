const express = require('express');
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
const authRoutes = require('./login');

const { globalErrorHandler } = require('./utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors());
app.use(express.json());

// Register routes
app.use('/', adminRoutes);
app.use('/', doctorRoutes);
app.use('/', labtechRoutes);
app.use('/', pharmacistRoutes);
app.use('/', receptionistRoutes);
app.use('/', authRoutes);

// Global error handler (must be last)
app.use(globalErrorHandler);

// Server Start
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});
