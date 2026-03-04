const mongoose = require('mongoose');

/**
 * Attendance Schema: Tracks daily presence counts and student references.
 * Ensures a unique record for each calendar date.
 */
const AttendanceSchema = new mongoose.Schema({
    // Unique date string (YYYY-MM-DD) to ensure one entry per day
    date: { type: String, required: true, unique: true }, 
    
    // Total number of students marked as present
    presentCount: { type: Number, default: 0 },
    
    // Array of Student ObjectIDs for detailed attendance tracking
    studentsPresent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }] 
});

module.exports = mongoose.model('Attendance', AttendanceSchema);