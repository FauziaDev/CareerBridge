const Student = require('../models/Student');
const path = require('path');

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student)
const getProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).populate('userId', 'name email contact');
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    res.status(200).json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (Student)
const updateProfile = async (req, res, next) => {
  try {
    const { college, course, year, cgpa, bio, skills } = req.body;
    const student = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { college, course, year, cgpa, bio, skills },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    res.status(200).json({ success: true, message: 'Profile updated', student });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/student/upload-resume
// @access  Private (Student)
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a PDF file' });

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const student = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { resumeUrl },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Resume uploaded successfully', resumeUrl });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, uploadResume };
