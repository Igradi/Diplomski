const express = require('express');
const router = express.Router();
const Notification = require('../models/NotificationModel');
const verifyToken = require('../middleware/verifyToken');


async function getNotificationsForUser(req, res) {
    const { userId } = req.params;
    try {
        const notifications = await Notification.find({ user: userId, read: false })
            .populate('fromUser', 'username');
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}



async function markAsRead(req, res) {

    const { notificationId } = req.params;
    try {
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
}


router.get('/:userId', verifyToken, getNotificationsForUser);
router.put('/mark-as-read/:notificationId', verifyToken, markAsRead);

module.exports = router;
