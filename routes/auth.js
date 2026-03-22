// \IB_Student_Management\routes\auth.js

const express = require('express');
const auth_router = express.Router();

// Simple Teacher Login 
auth_router.post('/login', (req, res) => {
    //taking input from body of request
    const user_input = req.body.username; 
    const pass_input = req.body.password;
    //checking credentials from environment variable 
    if (user_input === process.env.ADMIN_USER && pass_input === process.env.ADMIN_PASS) {
        console.log("login successful: teacher access granted.");
        res.json({ success: true });
    } else {
        console.log("login failed: wrong credentials.");
        res.status(401).json({ success: false,
             message: "wrong details!" 
        });
    }
});

module.exports = auth_router;