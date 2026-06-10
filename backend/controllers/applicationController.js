const Application = require('../models/Application');
const Student = require('../models/Student');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// @desc    Get all applications (student sees own, recruiter sees for their jobs)
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res, next) => {
  try {
    let applications;

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

      applications = await Application.find({ studentId: student._id })
        .populate('jobId', 'title location stipend type skillsRequired applicationDeadline')
        .populate({ path: 'jobId', populate: { path: 'recruiterId', select: 'companyName' } })
        .sort({ appliedAt: -1 });
    } else {
      applications = await Application.find()
        .populate('jobId', 'title location')
        .populate('studentId', 'userId college course')
        .sort({ appliedAt: -1 });
    }

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
const getJobApplicants = async (req, res, next) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .sort({ appliedAt: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Student)
const applyJob = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'active') return res.status(400).json({ success: false, message: 'Job is no longer active' });

    // Check if already applied
    const existing = await Application.findOne({ jobId: req.params.jobId, studentId: student._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied to this job' });

    const application = await Application.create({
      jobId: req.params.jobId,
      studentId: student._id,
      resumeUrl: student.resumeUrl || '',
    });

    // Add to student's appliedJobs
    student.appliedJobs.push(job._id);
    await student.save();

    // Create notification for student
    await Notification.create({
      userId: req.user.id,
      message: `You have successfully applied for ${job.title}`,
      type: 'success',
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully', application });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate({ path: 'studentId', populate: { path: 'userId', select: 'name _id' } });

    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    // Notify student about status change
    if (application.studentId?.userId) {
      const job = await Job.findById(application.jobId).select('title');
      await Notification.create({
        userId: application.studentId.userId._id,
        message: `Your application for ${job?.title} has been updated to: ${status}`,
        type: status === 'Rejected' ? 'warning' : status === 'Selected' ? 'success' : 'info',
      });
    }

    res.status(200).json({ success: true, message: 'Status updated', application });
  } catch (error) {
    next(error);
  }
};

module.exports = { getApplications, getJobApplicants, applyJob, updateStatus };
