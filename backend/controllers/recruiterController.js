const Recruiter = require('../models/Recruiter');

// @desc    Get recruiter profile
// @route   GET /api/recruiter/profile
// @access  Private (Recruiter)
const getProfile = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ userId: req.user.id }).populate('userId', 'name email');
    if (!recruiter) return res.status(404).json({ success: false, message: 'Recruiter profile not found' });
    res.status(200).json({ success: true, recruiter });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recruiter profile
// @route   PUT /api/recruiter/profile
// @access  Private (Recruiter)
const updateProfile = async (req, res, next) => {
  try {
    const { companyName, industry, website, companyDesc } = req.body;
    const recruiter = await Recruiter.findOneAndUpdate(
      { userId: req.user.id },
      { companyName, industry, website, companyDesc },
      { new: true, runValidators: true }
    );
    if (!recruiter) return res.status(404).json({ success: false, message: 'Recruiter profile not found' });
    res.status(200).json({ success: true, message: 'Profile updated', recruiter });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
