const mongoose = require('mongoose');
const Comment = require('../models/CommentModel');

async function deleteCommentsForPost(next) {
    try {
        const postId = this.getFilter()["_id"];
        const post = await mongoose.model('Posts').findById(postId);
        if (post) {
            await Comment.deleteMany({ _id: { $in: post.comments } });
        }
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { deleteCommentsForPost };
