const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const doctorRoutes = require('./routes/doctorRoutes');

const app = express();
const PORT = process.env.PORT || 8002;

app.use(cors());
app.use(express.json());
app.use(doctorRoutes);

//connect to db and start the server
connectDB().then(() => {
    app.listen(PORT,() => {
        console.log(`Server running on port ${PORT}`);
    });
});