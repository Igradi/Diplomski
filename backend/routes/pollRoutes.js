const express = require('express');
const router = express.Router();
const Poll = require('../models/PollModel');

async function getAllPolls(req, res) {
    try {
        const polls = await Poll.find({});
        res.json(polls);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function getPollById(req, res) {
    const { id } = req.params;
    try {
        const poll = await Poll.findById(id);
        if (!poll) {
            return res.status(404).json({ msg: 'Anketa nije pronađena' });
        }
        res.json(poll);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function createPoll(req, res) {
    try {
        const newPoll = new Poll(req.body);
        await newPoll.save();
        res.json({ msg: 'Nova anketa je uspješno kreirana', poll: newPoll });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function deletePoll(req, res) {
    const { id } = req.params;
    try {
        const poll = await Poll.findById(id);
        if (!poll) {
            return res.status(404).json({ msg: 'Anketa nije pronađena' });
        }
        await Poll.deleteOne({ _id: id });
        res.json({ msg: 'Anketa je uspješno obrisana' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

router.get('/getAllPolls', getAllPolls);
router.get('/:id', getPollById);
router.post('/createPoll', createPoll);
router.delete('/deletePoll/:id', deletePoll);

module.exports = router;
