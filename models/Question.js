// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
});

module.exports = mongoose.model('Question', questionSchema);
