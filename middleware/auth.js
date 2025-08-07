// middleware/auth.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const Student = require('../models/Student');

// General protect middleware (either student or admin)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-password');
      } else if (decoded.role === 'student') {
        req.user = await Student.findById(decoded.id).select('-password');
      } else {
        res.status(403);
        throw new Error('Invalid user role');
      }

      req.userRole = decoded.role;
      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Restrict to Admin only
const isAdmin = (req, res, next) => {
  if (req.userRole === 'admin' && req.user) {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied. Admin only');
  }
};

// Restrict to Student only
const isStudent = (req, res, next) => {
  if (req.userRole === 'student' && req.user) {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied. Student only');
  }
};

module.exports = { protect, isAdmin, isStudent };
