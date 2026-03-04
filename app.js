const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import Route Handlers
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const attendanceRoutes = require('./routes/attendance');

// 1. Load Environment Variables
dotenv.config();

// 2. Initialize Express Application
const app = express(); 

// 3. Mongoose Configuration to suppress warnings
mongoose.set('returnDocument', 'after'); 

// 4. Global Middlewares
app.use(express.json()); // Parse incoming JSON requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static assets (HTML/CSS/JS)

// 5. API Route Configuration
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

// 6. MongoDB Atlas Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("IB Database Connected! ✅"))
    .catch(err => console.log("Database Connection Error: ", err));

// 7. Base Route for Entry Point
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server on defined Port or default 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});