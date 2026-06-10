const express = require('express');
const router = express.Router();
const { getPendingCompanies, getAllCompanies, approveCompany, deleteUser, getStats, getAllUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/pending-companies', protect, authorize('admin'), getPendingCompanies);
router.get('/companies', protect, authorize('admin'), getAllCompanies);
router.post('/approve-company', protect, authorize('admin'), approveCompany);
router.delete('/delete-user/:userId', protect, authorize('admin'), deleteUser);
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
