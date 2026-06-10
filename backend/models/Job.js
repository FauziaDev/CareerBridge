const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true,
  },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  location:    { type: String, required: true },
  stipend:     { type: String, default: '' },
  type: {
    type: String,
    enum: ['Internship', 'Full-time', 'Part-time', 'Contract'],
    default: 'Internship',
  },
  skillsRequired: [{ type: String }],
  applicationDeadline: { type: Date },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
