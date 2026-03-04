const mongoose = require('mongoose');

/**
 * Student Schema: Defines the structural blueprint for student records.
 * Ensures data integrity through validation and unique constraints.
 */
const studentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    sClass: { 
        type: String, 
        required: true 
    },
    roll: { 
        type: String, 
        required: true,
        unique: true // Ensures no two students share the same roll number
    },
    dateAdded: { 
        type: Date, 
        default: Date.now // Automatically captures the record creation timestamp
    }
});

module.exports = mongoose.model('Student', studentSchema);