const express = require('express');
const router = express.Router();
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const verifyToken = require('../middleware/verifyToken');

async function getAllPosts(req, res) {
    try {
        const posts = await Post.find({}).populate('user', 'username');
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}


async function getPostById(req, res) {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ msg: 'Post nije pronađen' });
        }

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function createPost(req, res) {
    try {
        const newPostData = { ...req.body };
        const newPost = new Post(newPostData);
        await newPost.save();
        res.json({ msg: 'Novi post je uspješno kreiran', post: newPost });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function updatePost(req, res) {
    const { id } = req.params;
    const { content } = req.body;

    try {
        let post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ msg: 'Post nije pronađen' });
        }

        post.content = content;
        await post.save();

        res.json({ msg: 'Post je uspješno ažuriran', post });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function deletePost(req, res) {
    const { id } = req.params;

    try {
        let post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ msg: 'Post nije pronađen' });
        }

        await Post.deleteOne({ _id: id });

        res.json({ msg: 'Post je uspješno obrisan' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function postComment(req, res) {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post nije pronađen' });
        }
        const { content, user } = req.body;
        const newComment = new Comment({ content, user });
        await newComment.save();
        post.comments.push(newComment._id);
        await post.save();
        res.json({ msg: 'Komentar dodan uspješno', comment: newComment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}


async function upvotePost(req, res) {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post nije pronađen' });
        }

        if (post.upvotedBy.includes(userId)) {
            return res.status(400).json({ msg: 'Već ste upvotali ovaj post' });
        }

        if (post.downvotedBy.includes(userId)) {
            post.downvotes -= 1;
            const index = post.downvotedBy.indexOf(userId);
            post.downvotedBy.splice(index, 1);
        }

        post.upvotes += 1;
        post.upvotedBy.push(userId);
        await post.save();
        res.json({ msg: 'Post upvoted successfully', post });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function downvotePost(req, res) {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post nije pronađen' });
        }

        if (post.downvotedBy.includes(userId)) {
            return res.status(400).json({ msg: 'Već ste downvotali ovaj post' });
        }

        if (post.upvotedBy.includes(userId)) {
            post.upvotes -= 1;
            const index = post.upvotedBy.indexOf(userId);
            post.upvotedBy.splice(index, 1);
        }

        post.downvotes += 1;
        post.downvotedBy.push(userId);
        await post.save();
        res.json({ msg: 'Post downvoted successfully', post });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

router.get('/getAllPosts', verifyToken, getAllPosts);
router.get('/:id', verifyToken, getPostById);
router.post('/createPost', verifyToken, createPost);
router.put('/updatePost/:id', verifyToken, updatePost);
router.delete('/deletePost/:id', verifyToken, deletePost);
router.post('/:postId/comments', verifyToken, postComment);
router.put('/:postId/upvote', verifyToken, upvotePost);
router.put('/:postId/downvote', verifyToken, downvotePost);


module.exports = router;
