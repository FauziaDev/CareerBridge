const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  college: { type: String, default: '' },
  course:  { type: String, default: '' },
  year:    { type: Number, default: 1 },
  cgpa:    { type: Number, default: 0 },
  bio:     { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  skills: [{ type: String }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
