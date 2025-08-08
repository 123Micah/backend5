const Test = require('../models/Test');
// Get all tests
exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().populate('questions');
    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a test
exports.editTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const update = req.body;
    const test = await Test.findByIdAndUpdate(testId, update, { new: true }).populate('questions');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    console.error('Error editing test:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a test
exports.deleteTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const test = await Test.findByIdAndDelete(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const Submission = require('../models/Submission');

exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all submissions (admin view)
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('student', 'name email')
      .populate('test', 'title total')
      .populate({
        path: 'answers.questionId',
        model: 'Question',
        select: 'text options correctAnswer'
      })
      .sort({ createdAt: -1 }); // Sort by newest first

      // Transform the data if needed
      const transformed = submissions.map(sub => {
        const answers = sub.answers.map(ans => ({
          ...ans.toObject(),
          questionText: ans.questionId?.text,
          correctAnswer: ans.questionId?.correctAnswer
        }));
        return { ...sub.toObject(), answers };
      });
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};