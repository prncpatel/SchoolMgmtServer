const mongoose = require('mongoose');

// Admin Schema Definition
const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },
  email: { 
    type: String, 
    unique: true, 
    required: true, 
    match: [/\S+@\S+\.\S+/, 'is invalid'], // Regex to ensure email format
  },
  role: { 
    type: String, 
    enum: ['superadmin', 'admin'], 
    required: true 
  },
  password: {  // Changed from hashedPassword to keep naming consistent with the controller
    type: String, 
    required: true 
  },
  schoolName: { 
    type: String, 
    required: true// Only required for school admins
  },
  schoolId: { 
    type: String, 
    required: true // Only required for school admins
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Creating the Admin model from the schema
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
