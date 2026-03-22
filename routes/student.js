const express = require('express');
const router = express.Router();
const student = require('../models/Student');

router.post('/add', async (req, res) => {
    try {
        console.log("Adding Student:",req.body);
        const newstudent_obj = new student({
            name: req.body.name,
            sClass: req.body.sClass,
            roll: req.body.roll
        });
        await newstudent_obj.save();
        res.status(201).json(newstudent_obj);
    } catch (err) {
    
        if (err.code === 11000) {
            return res.status(400).json({ message: "roll number already exists , this student already in the list" });
        }
        console.error("roll number matched this student is already in the list.", err.message);
        res.status(400).json({ "Server error": err.message });
    }
});


router.get('/all', async (req, res) => {
    try {
        const students = await student.find() || []; 
        
        console.log("data successfully fetched.");
        res.status(200).json(students);
        
    } catch (err) {
        console.error("fetch failed :", err.message);
        res.status(500).json([]); 
    }
});


router.delete('/delete/:id', async (req, res) => {
    try {
        await student.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const { name, sClass, roll } = req.body;
        const updated_data = await student.findByIdAndUpdate(
            req.params.id,
            { name, sClass, roll },
            { new: true }
        );
        res.json(updated_data);
    } catch (err) {
        console.log("Update process failed.");
        res.status(500).json({ message: "update failed, please try again." });
    }
});

module.exports = router;