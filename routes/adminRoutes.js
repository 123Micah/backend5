// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllSubmissions } = require('../controllers/adminController');


router.get('/submissions', protect, isAdmin, getAllSubmissions);

module.exports = router;