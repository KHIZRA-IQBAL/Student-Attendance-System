const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const attendanceRoutes = require('./routes/attendance');

dotenv.config();
const app = express();

// --- Mongoose Configuration to fix warnings ---
mongoose.set('returnDocument', 'after'); 

// Middlewares
app.use(express.json()); 
app.use(express.static('public')); // Serves your HTML/CSS/JS files

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("IB Database Connected! ✅"))
    .catch(err => console.log("Database Connection Error: ", err));

// Basic Route for testing
app.get('/', (req, res) => {
    // This will redirect to your login page automatically if someone hits the root URL
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});