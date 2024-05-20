const express = require('express');
const router = express.Router();
const Poll = require('../models/PollModel');
const verifyToken = require('../middleware/verifyToken');

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

async function votePoll(req, res) {
    const { id } = req.params;
    const { selectedOptionIndex, userId } = req.body;

    try {
        const poll = await Poll.findById(id);
        if (!poll) {
            return res.status(404).json({ msg: 'Anketa nije pronađena' });
        }

        if (poll.answeredBy.includes(userId)) {
            return res.status(400).json({ msg: 'Već ste odgovorili na ovu anketu' });
        }

        poll.totalVotes += 1;
        if (selectedOptionIndex === poll.correctAnswerIndex) {
            poll.correctVotes += 1;
        }
        poll.answeredBy.push(userId);
        await poll.save();

        res.json({ msg: 'Glas je uspješno podnesen', poll });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

router.get('/getAllPolls', verifyToken, getAllPolls);
router.get('/:id', verifyToken, getPollById);
router.post('/createPoll', verifyToken, createPoll);
router.delete('/deletePoll/:id', verifyToken, deletePoll);
router.post('/votePoll/:id', verifyToken, votePoll);

module.exports = router;
