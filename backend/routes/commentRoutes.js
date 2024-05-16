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

async function createComment(req, res) {
    try {
        const newComment = new Comment(req.body);

        await newComment.save();

        res.json({ msg: 'Novi komentar je uspješno kreiran', comment: newComment });
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

router.get('/:id', verifyToken, getCommentById);
router.post('/createComment', verifyToken, createComment);
router.put('/updateComment/:id', verifyToken, updateComment);
router.delete('/deleteComment/:id', verifyToken, deleteComment);

module.exports = router;
