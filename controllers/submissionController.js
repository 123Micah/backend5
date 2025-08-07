const Submission = require('../models/Submission');

exports.getSubmissionsForTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const submissions = await Submission.find({ test: testId }).sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
