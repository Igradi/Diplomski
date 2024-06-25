const Comment = require('../models/CommentModel');

exports.getCommentById = async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found.' });
        }

        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        let comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found.' });
        }

        comment.content = content;
        await comment.save();

        res.json({ msg: 'Comment updated', comment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        let comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found.' });
        }

        await Comment.deleteOne({ _id: id });

        res.json({ msg: 'Comment deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.upvoteComment = async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found.' });
        }

        if (comment.upvotedBy.includes(userId)) {
            return res.status(400).json({ msg: 'You have already upvoted this comment' });
        }

        if (comment.downvotedBy.includes(userId)) {
            comment.downvotes -= 1;
            const index = comment.downvotedBy.indexOf(userId);
            comment.downvotedBy.splice(index, 1);
        }

        comment.upvotes += 1;
        comment.upvotedBy.push(userId);
        await comment.save();
        res.json({ msg: 'Comment upvoted successfully', comment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.downvoteComment = async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        if (comment.downvotedBy.includes(userId)) {
            return res.status(400).json({ msg: 'You have already downvoted this comment' });
        }

        if (comment.upvotedBy.includes(userId)) {
            comment.upvotes -= 1;
            const index = comment.upvotedBy.indexOf(userId);
            comment.upvotedBy.splice(index, 1);
        }

        comment.downvotes += 1;
        comment.downvotedBy.push(userId);
        await comment.save();
        res.json({ msg: 'Comment downvoted successfully', comment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
