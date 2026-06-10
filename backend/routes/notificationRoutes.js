const express = require('express');
const router = express.Router();
const { getNotifications, markRead, markAllRead, sendEmail } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getNotifications);
router.put('/read-all', protect, markAllRead);
router.put('/:id/read', protect, markRead);
router.post('/email', protect, sendEmail);

module.exports = router;
