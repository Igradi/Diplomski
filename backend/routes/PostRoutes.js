const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const postController = require('../controllers/postController');

router.get('/getAllPosts', verifyToken, postController.getAllPosts);
router.get('/:id', verifyToken, postController.getPostById);
router.post('/createPost', verifyToken, postController.createPost);
router.put('/updatePost/:id', verifyToken, postController.updatePost);
router.delete('/deletePost/:id', verifyToken, postController.deletePost);
router.post('/:postId/comments', verifyToken, postController.postComment);
router.put('/:postId/upvote', verifyToken, postController.upvotePost);
router.put('/:postId/downvote', verifyToken, postController.downvotePost);
router.get('/:postId/comments', verifyToken, postController.getCommentsForPost);

module.exports = router;
