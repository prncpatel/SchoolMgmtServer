// models/Admin.js
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ['superadmin', 'admin'], required: true },
  hashedPassword: { type: String, required: true },
  schoolName: { type: String }, // For school admins
  schoolId: { type: String }, // For school admins
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
