const express = require('express');
const router = express.Router();
const Notification = require('../models/NotificationModel');
const verifyToken = require('../middleware/verifyToken');


async function getNotificationsForUser(req, res) {
    const { userId } = req.params;
    try {
        const notifications = await Notification.find({ user: userId, read: false });
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}


async function markAsRead(req, res) {
    const { notificationId } = req.params;
    try {
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        res.status(200).send('Obavijest označena kao pročitana');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

router.get('/:userId', verifyToken, getNotificationsForUser);
router.put('/mark-as-read/:notificationId', verifyToken, markAsRead);

module.exports = router;
