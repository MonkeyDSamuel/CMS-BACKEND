const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9002;

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
const labtechRoutes = require('./routes/labtechRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const pharmacistRoutes = require('./routes/pharmacistRoutes');

// Register routes
app.use('/api/labtech', labtechRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/inventories', inventoryRoutes);
app.use('/api/pharmacist', pharmacistRoutes);

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});