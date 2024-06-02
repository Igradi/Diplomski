const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    type: { type: String, enum: ['comment'], required: true },
    message: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts', required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notifications', notificationSchema);
