const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { adminProtect } = require('../middlewares/authMiddleware')
const router = express.Router();

// Route to register a new user (Super Admin or Admin)
router.post('/register', adminProtect, registerUser);

// Route to login a user
router.post('/login', loginUser);

module.exports = router;
