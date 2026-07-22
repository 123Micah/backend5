// routes/authRoutes.js
const express = require('express');
const router = express.Router();

const {
  adminLogin,
  adminRegister,
  studentLogin,
  studentRegister,
} = require('../controllers/authController');

router.post('/admin/login', adminLogin);
router.post('/admin/register', adminRegister);  // TEMPORARY - Remove in production
router.post('/student/register', studentRegister);
router.post('/student/login', studentLogin);

module.exports = router;
