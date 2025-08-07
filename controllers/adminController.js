const Submission = require('../models/Submission');

// Get all submissions (admin view)
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await require('../models/Submission')
      .find()
      .populate('student', 'name email')
      .populate('test', 'title');
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


