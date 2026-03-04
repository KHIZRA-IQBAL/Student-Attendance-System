const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Set current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// API: Save or Update Daily Attendance
router.post('/save', async (req, res) => {
    try {
        const { count } = req.body;
        
        // Find existing record for today to update, or create a new one (Upsert)
        const record = await Attendance.findOneAndUpdate(
            { date: today },
            { presentCount: count },
            { upsert: true, new: true }
        );
        res.status(200).json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Retrieve Current Attendance Count
router.get('/today', async (req, res) => {
    try {
        const record = await Attendance.findOne({ date: today });
        res.status(200).json(record || { presentCount: 0 });
    } catch (err) {
        res.status(500).json({ presentCount: 0 });
    }
});

module.exports = router;