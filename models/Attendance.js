// IB_Student_Management\models\Attendance.js
const mongoose = require('mongoose');


//for daily attendance schema
const Attendance_Plan = new mongoose.Schema({
    // only one entry per day (Format: Y-M-D)
    date: { type: String, required: true, unique: true }, 
    
    // how many students are present today (Total count)
    presentCount: { type: Number, default: 0 },
    
    //this is an array of student IDs who are present on that day
    studentsPresent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }] 
});

module.exports = mongoose.model('Attendance', Attendance_Plan);