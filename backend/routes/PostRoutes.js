const express = require('express');
const router = express.Router();
const Post = require('../models/PostModel');


async function getAllPosts(req, res) {
    try {
        const posts = await Post.find({});
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

router.get('/getAllPosts', getAllPosts);
router.get('/:id', getPostById);
router.post('/createPost', createPost);
router.put('/updatePost/:id', updatePost);
router.delete('/deletePost/:id', deletePost);

module.exports = router;
