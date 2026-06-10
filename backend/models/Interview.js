const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  interviewDate: { type: Date, required: true },
  interviewTime: { type: String, required: true },
  mode: {
    type: String,
    enum: ['Online', 'Offline'],
    default: 'Online',
  },
  link:   { type: String, default: '' },
  notes:  { type: String, default: '' },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
