const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const commentController = require('../controllers/commentController');

router.get('/:id', verifyToken, commentController.getCommentById);
router.put('/updateComment/:id', verifyToken, commentController.updateComment);
router.delete('/deleteComment/:id', verifyToken, commentController.deleteComment);

module.exports = router;
