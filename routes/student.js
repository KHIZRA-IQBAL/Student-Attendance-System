const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// API: Add New Student
router.post('/add', async (req, res) => {
    try {
        console.log("Adding Student:", req.body);
        const newStudent = new Student({
            name: req.body.name,
            sClass: req.body.sClass,
            roll: req.body.roll
        });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        // Handle MongoDB duplicate key error (Code 11000)
        if (err.code === 11000) {
            return res.status(400).json({ message: "Duplicate Roll Number! This student already exists." });
        }
        console.error("Add Error:", err.message);
        res.status(400).json({ message: err.message });
    }
});

// API: Retrieve All Student Records
router.get('/all', async (req, res) => {
    try {
        // Fetch students from database; return empty array if no records found
        const students = await Student.find() || []; 
        
        // Return 200 status with student array to prevent frontend errors
        res.status(200).json(students);
        
    } catch (err) {
        console.error("Fetch Error:", err.message);
        // Ensure an empty array is returned on failure to maintain frontend stability
        res.status(500).json([]); 
    }
});

// API: Delete Student Record by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Update Existing Student Record
router.put('/update/:id', async (req, res) => {
    try {
        const { name, sClass, roll } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { name, sClass, roll },
            { new: true } // Return the updated document
        );
        res.json(updatedStudent);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

module.exports = router;