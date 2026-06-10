const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/auth');

router.get('/profile', protect, authorize('recruiter'), getProfile);
router.put('/profile', protect, authorize('recruiter'), updateProfile);

module.exports = router;
