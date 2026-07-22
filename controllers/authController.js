// controllers/authController.js
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1500d',
  });
};



// Admin Login
exports.adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      email: admin.email,
      role: 'admin',
      token: generateToken(admin._id, 'admin'),
    });
  } else {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }
});

// Admin Register (TEMPORARY - Remove in production)
exports.adminRegister = asyncHandler(async (req, res) => {
  const { email, password, secretKey } = req.body;
  
  // TEMPORARY SECURITY: Simple secret key check
  // Replace with proper admin invitation system in production
  const TEMP_ADMIN_SECRET = process.env.TEMP_ADMIN_SECRET || 'temp-admin-key-change-me';
  
  if (secretKey !== TEMP_ADMIN_SECRET) {
    res.status(403);
    throw new Error('Invalid admin registration key');
  }
  
  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  const admin = await Admin.create({ email, password });

  res.status(201).json({
    _id: admin._id,
    email: admin.email,
    role: 'admin',
    token: generateToken(admin._id, 'admin'),
  });
});

// Student Register
exports.studentRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const studentExists = await Student.findOne({ email });

  if (studentExists) {
    res.status(400);
    throw new Error('Student already exists');
  }

  const student = await Student.create({ name, email, password });

  res.status(201).json({
    _id: student._id,
    name: student.name,
    email: student.email,
    role: 'student',
    token: generateToken(student._id, 'student'),
  });
});

// Student Login
exports.studentLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email });

  if (student && (await student.matchPassword(password))) {
    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: 'student',
      token: generateToken(student._id, 'student'),
    });
  } else {
    res.status(401);
    throw new Error('Invalid student credentials');
  }
});

