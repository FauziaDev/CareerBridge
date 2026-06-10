const express = require('express');
const router = express.Router();
const { getApplications, getJobApplicants, applyJob, updateStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.post('/apply/:jobId', protect, authorize('student'), applyJob);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateStatus);

module.exports = router;
