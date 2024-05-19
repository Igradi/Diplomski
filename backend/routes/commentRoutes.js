const express = require('express');
const router = express.Router();
const Comment = require('../models/CommentModel');
const verifyToken = require('../middleware/verifyToken');

async function getCommentById(req, res) {
    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ msg: 'Komentar nije pronađen' });
        }

        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function updateComment(req, res) {
    const { id } = req.params;
    const { content } = req.body;

    try {
        let comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ msg: 'Komentar nije pronađen' });
        }

        comment.content = content;
        await comment.save();

        res.json({ msg: 'Komentar je uspješno ažuriran', comment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function deleteComment(req, res) {
    const { id } = req.params;

    try {
        let comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ msg: 'Komentar nije pronađen' });
        }

        await Comment.deleteOne({ _id: id });

        res.json({ msg: 'Komentar je uspješno obrisan' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function upvoteComment(req, res) {
    const { commentId } = req.params;
    const { userId } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Komentar nije pronađen' });
        }

        if (comment.upvotedBy.includes(userId)) {
            return res.status(400).json({ msg: 'Već ste upvotali ovaj komentar' });
        }

        if (comment.downvotedBy.includes(userId)) {
            comment.downvotes -= 1;
            const index = comment.downvotedBy.indexOf(userId);
            comment.downvotedBy.splice(index, 1);
        }

        comment.upvotes += 1;
        comment.upvotedBy.push(userId);
        await comment.save();
        res.json({ msg: 'Komentar upvoted successfully', comment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function downvoteComment(req, res) {
    const { commentId } = req.params;
    const { userId } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Komentar nije pronađen' });
        }

        if (comment.downvotedBy.includes(userId)) {
            return res.status(400).json({ msg: 'Već ste downvotali ovaj komentar' });
        }

        if (comment.upvotedBy.includes(userId)) {
            comment.upvotes -= 1;
            const index = comment.upvotedBy.indexOf(userId);
            comment.upvotedBy.splice(index, 1);
        }

        comment.downvotes += 1;
        comment.downvotedBy.push(userId);
        await comment.save();
        res.json({ msg: 'Komentar downvoted successfully', comment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

router.get('/:id', verifyToken, getCommentById);
router.put('/updateComment/:id', verifyToken, updateComment);
router.delete('deleteComment/:id', verifyToken, deleteComment);
router.put('/:commentId/upvote', verifyToken, upvoteComment);
router.put('/:commentId/downvote', verifyToken, downvoteComment);

module.exports = router;
