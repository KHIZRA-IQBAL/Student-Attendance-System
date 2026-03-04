const express = require('express');
const router = express.Router();

// IB Requirement: Simple Teacher Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Ghalat details!" });
    }
});

module.exports = router;