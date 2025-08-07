// controllers/studentController.js
const asyncHandler = require('express-async-handler');
const Test = require('../models/Test');
const Submission = require('../models/Submission');

// 1. Get all available tests
exports.getTests = asyncHandler(async (req, res) => {
  const tests = await Test.find().sort({ createdAt: -1 });
  res.json(tests);
});

// 2. Get all questions for a test (without correct answers)
exports.getTestQuestions = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const test = await Test.findById(testId);
  if (!test) {
    return res.status(404).json({ message: 'Test not found' });
  }
  // Exclude correctAnswer from each question
  const questions = test.questions.map(({ _id, text, image, options }) => ({ _id, text, image, options }));
  res.json(questions);
});

// 3. Submit answers
exports.submitTest = asyncHandler(async (req, res) => {
  const { testId, answers } = req.body;
  const test = await Test.findById(testId).populate('questions');
  if (!test) {
    return res.status(404).json({ message: 'Test not found' });
  }
  let score = 0;
  const answerResults = answers.map((ans) => {
    const question = test.questions.find(q => q._id.toString() === ans.questionId);
    const isCorrect = question && question.correctAnswer === ans.selectedOption;
    if (isCorrect) score += 1;
    return {
      questionId: ans.questionId,
      selectedOption: ans.selectedOption,
      isCorrect,
    };
  });
  const submission = await Submission.create({
    student: req.user._id,
    test: testId,
    answers: answerResults,
    score,
  });
  res.status(201).json({ message: 'Test submitted', score });
});

// 4. Get student's own submissions
exports.getSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ student: req.user._id })
    .populate('test', 'title')
    .sort({ submittedAt: -1 });

  res.json(submissions);
});
