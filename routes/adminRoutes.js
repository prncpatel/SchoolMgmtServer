const express = require('express');
const router = express.Router();
const { createAdmin , login } = require('../controllers/adminController');

// Route to create a new admin and setup a school DB
router.post('/create', createAdmin);

router.post('/login', login);

module.exports = router;
