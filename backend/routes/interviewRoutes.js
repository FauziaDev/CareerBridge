const express = require('express');
const router = express.Router();
const { getInterviews, scheduleInterview, updateInterviewStatus } = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getInterviews);
router.post('/:applicationId', protect, authorize('recruiter'), scheduleInterview);
router.put('/:interviewId/status', protect, authorize('recruiter', 'admin'), updateInterviewStatus);

module.exports = router;
