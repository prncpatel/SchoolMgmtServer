// routes/adminRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const verifySuperAdmin = require('../middlewares/verifySuperAdmin');

const router = express.Router();

// Route to initialize super admin (call this once, e.g., on server start)
router.post('/initialize-superadmin', async (req, res) => {
    try {
        const existingSuperAdmin = await Admin.findOne({ role: 'superadmin' });

        if (existingSuperAdmin) {
            return res.status(400).send('Super admin already exists.');
        }

        const hashedPassword = await bcrypt.hash('s@admin', 10); // Use a secure password

        const superAdmin = new Admin({
            email: 'superadmin@example.com', // Change to your desired email
            role: 'superadmin',
            hashedPassword,
        });

        await superAdmin.save();
        res.status(201).send('Super admin created successfully.');
    } catch (error) {
        res.status(500).send('Error initializing super admin.');
    }
});

// Route to log in and get a token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).send('Admin not found.');
        }

        const isMatch = await bcrypt.compare(password, admin.hashedPassword);
        if (!isMatch) {
            return res.status(401).send('Invalid password.');
        }

        const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).send('Error logging in.');
    }
});

// Route to add a school admin
router.post('/add-admin', verifySuperAdmin, async (req, res) => {
    const { name, email, password, schoolName, schoolId } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if(admin){
           return res.status(400).send("admin already exists.")
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            name,
            email,
            role: 'admin',
            hashedPassword,
            schoolName,  // Store the school name
            schoolId     // Store the unique school identifier
        });

        await newAdmin.save();
        res.status(201).send('School admin created successfully.');
    } catch (error) {
        res.status(500).send('Error creating school admin.');
    }
});

module.exports = router;
