// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isStudent } = require('../middleware/auth');
const {
  getTests,
  getTestQuestions,
  submitTest,
  getSubmissions,
} = require('../controllers/studentController');

router.get('/tests', protect, isStudent, getTests);
router.get('/tests/:testId/questions', protect, isStudent, getTestQuestions);
router.post('/tests/submit', protect, isStudent, submitTest);


module.exports = router;
