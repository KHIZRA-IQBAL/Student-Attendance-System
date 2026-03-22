const express = require('express');
const router = express.Router();
const AttendanceModel = require('../models/Attendance');

const current_date = new Date().toISOString().split('T')[0];


router.post('/save', async (req, res) => {
    try {
        const attendance_count = req.body.count;
        console.log("Saving attendance for date:", current_date)
        const final_record = await AttendanceModel.findOneAndUpdate(
            { date: current_date },
            { presentCount: attendance_count },
            { upsert: true, new: true }
        );
        console.log("data successfully saved");
        res.status(200).json(final_record);
    } catch (err) {
        console.error("error found in saving attedence:", err.message);
        res.status(500).json({ error: err.message });
    }
});

router.get('/today', async (req, res) => {
    try {
        const record = await AttendanceModel.findOne({ date: current_date });
        res.status(200).json(record || { presentCount: 0 });
    } catch (err) {
        res.status(500).json({ presentCount: 0 });
    }
});

module.exports = router;