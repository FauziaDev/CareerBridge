const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Student = require('../models/Student');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res, next) => {
  try {
    let interviews;

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      const myApps = await Application.find({ studentId: student._id }).select('_id');
      const appIds = myApps.map(a => a._id);

      interviews = await Interview.find({ applicationId: { $in: appIds } })
        .populate({
          path: 'applicationId',
          populate: [
            { path: 'jobId', select: 'title', populate: { path: 'recruiterId', select: 'companyName' } },
          ],
        })
        .sort({ interviewDate: 1 });
    } else {
      interviews = await Interview.find()
        .populate({
          path: 'applicationId',
          populate: [
            { path: 'jobId', select: 'title' },
            { path: 'studentId', populate: { path: 'userId', select: 'name email' } },
          ],
        })
        .sort({ interviewDate: 1 });
    }

    res.status(200).json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule interview
// @route   POST /api/interviews/:applicationId
// @access  Private (Recruiter)
const scheduleInterview = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate({ path: 'studentId', populate: { path: 'userId', select: '_id name' } })
      .populate('jobId', 'title');

    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    const interview = await Interview.create({
      applicationId: req.params.applicationId,
      ...req.body,
    });

    // Update application status
    application.status = 'Interview Scheduled';
    await application.save();

    // Notify student
    if (application.studentId?.userId) {
      await Notification.create({
        userId: application.studentId.userId._id,
        message: `Interview scheduled for ${application.jobId?.title} on ${req.body.interviewDate} at ${req.body.interviewTime}`,
        type: 'info',
      });
    }

    res.status(201).json({ success: true, message: 'Interview scheduled', interview });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview status
// @route   PUT /api/interviews/:interviewId/status
// @access  Private (Recruiter)
const updateInterviewStatus = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.interviewId,
      { status: req.body.status },
      { new: true }
    );
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    res.status(200).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

module.exports = { getInterviews, scheduleInterview, updateInterviewStatus };
