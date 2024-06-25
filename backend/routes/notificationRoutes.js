const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const notificationController = require('../controllers/notificationController');

router.get('/:userId', verifyToken, notificationController.getNotificationsForUser);
router.put('/mark-as-read/:notificationId', verifyToken, notificationController.markAsRead);

module.exports = router;
