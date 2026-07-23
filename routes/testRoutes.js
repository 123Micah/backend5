const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getTest,
  createTest,
  addQuestion,
  submitTest,
  } = require('../controllers/testController');

  router.post('/create-test', protect, isAdmin, createTest);
  router.post('/add-question', protect, isAdmin, upload.single('image'), addQuestion);
  router.post('/submit/:id', protect, submitTest);
  router.get('/:id', getTest);  // Allow public access to view test content
  
  module.exports = router;
