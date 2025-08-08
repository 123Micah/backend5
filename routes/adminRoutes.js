// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllSubmissions, deleteSubmission } = require('../controllers/adminController');

router.delete('/submissions/:id', protect, isAdmin, deleteSubmission);

router.get('/submissions', protect, isAdmin, getAllSubmissions);

module.exports = router;