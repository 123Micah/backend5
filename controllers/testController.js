// controllers/testController.js
const asyncHandler = require('express-async-handler');
const Test = require('../models/Test');
const Question = require('../models/Question');
const cloudinary = require('../config/cloudinary');

// Get a test by ID and populate questions
exports.getTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id).populate('questions');
  if (!test) {
    return res.status(404).json({ message: 'Test not found' });
  }
  res.json(test);
});


// Create a new test with questions (all in one go)
exports.createTest = asyncHandler(async (req, res) => {
  const { title, description, questions, duration } = req.body;
  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: 'Title and at least one question are required' });
  }
  // duration: { hours, minutes, seconds }
  const test = await Test.create({
    title,
    description,
    questions: [],
    createdBy: req.user._id,
    duration: duration || { hours: 0, minutes: 0, seconds: 0 },
  });
  // 2. Create each question and collect their IDs
  const questionDocs = await Promise.all(
    questions.map(async (q) => {
      const question = await Question.create({
        text: q.text,
        image: q.image,
        options: q.options,
        correctAnswer: q.correctAnswer,
        test: test._id,
      });
      return question._id;
    })
  );
  // 3. Update the test with the question IDs
  test.questions = questionDocs;
  await test.save();
  res.status(201).json(test);
});

// Add a question to an existing test (with optional image)

exports.addQuestion = asyncHandler(async (req, res) => {
  const { testId, text, options, correctAnswer } = req.body;
  let image = '';
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    image = result.secure_url;
  }
  // Create the question document
  const question = await Question.create({
    text,
    image,
    options,
    correctAnswer,
    test: testId,
  });
  // Push the question ID to the test's questions array
  const test = await Test.findByIdAndUpdate(
    testId,
    { $push: { questions: question._id } },
    { new: true }
  );
  if (!test) {
    return res.status(404).json({ message: 'Test not found' });
  }
  res.status(201).json(test);
});
;

exports.submitTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const { answers } = req.body;

    // Fetch test and populate questions to get correct answers
    const test = await Test.findById(testId).populate('questions');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    let score = 0;
    let correctCount = 0;

    // answers: [{ questionId, selectedOption }]
    test.questions.forEach((q, index) => {
      const userAnswer = answers.find(a => a.questionId == q._id.toString());
      if (userAnswer) {
        if (userAnswer.selectedOption === q.correctAnswer) {
          score++;
          correctCount++;
        } else {
          score--;
        }
      }
    });

    res.json({ score, correctCount });
  } catch (error) {
    console.error('Submit Test Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id).populate('questions');
  if (!test) {
    return res.status(404).json({ message: 'Test not found' });
  }
  res.json(test);
});





