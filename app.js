// IB_Student_Management\app.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const env_config = require('dotenv');

//Route Handlers
const userAuth = require('./routes/auth');
const stdRecord = require('./routes/student');
const att_system  = require('./routes/attendance');

//Load 
env_config.config();

//express Initialize 
const app = express(); 

// mongoose ki setting
mongoose.set('returnDocument', 'after'); 

//middleware setup
app.use(express.json()); 
console.log("Middlewares loading... please wait");
app.use(express.static(path.join(__dirname, 'public'))); 

//api route
app.use('/api/auth', userAuth);
app.use('/api/students', stdRecord);
app.use('/api/attendance', att_system);

//Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("IB Database Connected"))
    .catch(err => console.log("Database giving me some error",err));

//Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//setting for starting server 
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});