// IB_Student_Management\models\Student.js
const mongoose = require('mongoose');

//database structure of student
const student_blueprint = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, //this field is mandatory
        trim: true // for removing whitespace 
    },
    sClass: { 
        type: String, 
        required: true 
    },
    roll: { 
        type: String, 
        required: true,
        unique: true //roll number should be unique 
    },
    dateAdded: { 
        type: Date, 
        default: Date.now //this is auutomatically set the date when a student is added
    }
});

const Student = mongoose.model('Student', student_blueprint);
module.exports = Student;