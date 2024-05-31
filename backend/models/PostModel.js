const mongoose = require('mongoose');
const { deleteCommentsForPost } = require('../middleware/deleteCommentsWithPosts');

const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Currencys', required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }]
}, { timestamps: true });

postSchema.pre('deleteOne', { document: false, query: true }, deleteCommentsForPost);

module.exports = mongoose.model('Posts', postSchema);
