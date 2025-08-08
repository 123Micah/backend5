// models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', 
    required: true,
    index: true // Added index for better query performance
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
    index: true
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
      },
      selectedOption: {
        type: String,
        required: true
      },
      isCorrect: {
        type: Boolean,
        required: true
      },
      _id: false // Prevent automatic _id creation for subdocuments
    }
  ],
  score: {
    type: Number,
    required: true,
    min: 0 // Ensure score can't be negative
  },
  total: { // Added total score field for reference
    type: Number,
    required: true,
    min: 1 // At least 1 point total
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true // Index for sorting
  },

  timeSpent: { // Added optional field for tracking time
    type: Number,
    min: 0 // In seconds
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true }, // Include virtuals when converted to JSON
  toObject: { virtuals: true } // Include virtuals when converted to objects
});

// Virtual for percentage score
submissionSchema.virtual('percentage').get(function() {
  return Math.round((this.score / this.total) * 100);
});

// Index for frequently queried fields
submissionSchema.index({ student: 1, test: 1, isDeleted: 1 });

module.exports = mongoose.model('Submission', submissionSchema);