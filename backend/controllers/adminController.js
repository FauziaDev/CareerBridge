const User = require('../models/User');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

// @desc    Get all pending companies
// @route   GET /api/admin/pending-companies
// @access  Private (Admin)
const getPendingCompanies = async (req, res, next) => {
  try {
    const companies = await Recruiter.find({ status: 'pending' }).populate('userId', 'name email createdAt');
    res.status(200).json({ success: true, count: companies.length, companies });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies
// @route   GET /api/admin/companies
// @access  Private (Admin)
const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Recruiter.find().populate('userId', 'name email createdAt');
    res.status(200).json({ success: true, count: companies.length, companies });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve company
// @route   POST /api/admin/approve-company
// @access  Private (Admin)
const approveCompany = async (req, res, next) => {
  try {
    const { recruiterId, action } = req.body; // action: 'approve' | 'reject'
    const status = action === 'approve' ? 'approved' : 'rejected';

    const recruiter = await Recruiter.findByIdAndUpdate(recruiterId, { status }, { new: true })
      .populate('userId', 'name _id');

    if (!recruiter) return res.status(404).json({ success: false, message: 'Recruiter not found' });

    // Notify recruiter
    await Notification.create({
      userId: recruiter.userId._id,
      message: `Your company "${recruiter.companyName}" has been ${status} by admin.`,
      type: status === 'approved' ? 'success' : 'warning',
    });

    res.status(200).json({ success: true, message: `Company ${status}`, recruiter });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/delete-user/:userId
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Delete role-specific profile
    if (user.role === 'student') await Student.findOneAndDelete({ userId: user._id });
    if (user.role === 'recruiter') await Recruiter.findOneAndDelete({ userId: user._id });

    await User.findByIdAndDelete(req.params.userId);

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = async (req, res, next) => {
  try {
    const [totalStudents, totalRecruiters, totalJobs, totalApplications, pendingCompanies] = await Promise.all([
      Student.countDocuments(),
      Recruiter.countDocuments({ status: 'approved' }),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments(),
      Recruiter.countDocuments({ status: 'pending' }),
    ]);

    res.status(200).json({
      success: true,
      stats: { totalStudents, totalRecruiters, totalJobs, totalApplications, pendingCompanies },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const students = await Student.find().populate('userId', 'name email createdAt');
    const recruiters = await Recruiter.find().populate('userId', 'name email createdAt');
    res.status(200).json({ success: true, students, recruiters });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPendingCompanies, getAllCompanies, approveCompany, deleteUser, getStats, getAllUsers };
