const Admin = require('../models/Admin');
const createNewSchoolDB = require('../utils/createNewSchoolDB');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

// Function to handle new admin creation and school DB setup
const createAdmin = async (req, res) => {
    const { name, email, password, role, schoolName } = req.body;
    
    try {
        // 1. Generate unique school ID
        const schoolId = uuidv4();

        // 2. Check if the admin with this email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create new admin in central Admin DB
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            role,
            schoolName,
            schoolId, // unique ID for this school
        });

        await newAdmin.save();

        // 5. Create new school database using the provided school name
        await createNewSchoolDB(schoolName);

        res.status(201).json({ message: 'Admin and new school created successfully', schoolId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to handle admin login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in.' });
    }
};

// Export both functions
module.exports = {
    createAdmin,
    login
};


