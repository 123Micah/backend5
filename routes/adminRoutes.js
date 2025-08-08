// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllSubmissions, deleteSubmission, getAllTests, editTest, deleteTest } = require('../controllers/adminController');
// Get all tests
router.get('/tests', protect, isAdmin, getAllTests);

// Edit a test
router.put('/tests/:id', protect, isAdmin, editTest);

// Delete a test
router.delete('/tests/:id', protect, isAdmin, deleteTest);

router.delete('/submissions/:id', protect, isAdmin, deleteSubmission);

router.get('/submissions', protect, isAdmin, getAllSubmissions);

module.exports = router;