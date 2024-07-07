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
