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
        res.json({ msg: 'Novi kviz je uspješno kreiran', poll: newPoll });
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
    const { votes, userId } = req.body;

    try {
        const poll = await Poll.findById(id);

        if (!poll) {
            console.error('Poll not found');
            return res.status(404).json({ message: 'Poll not found' });
        }

        if (poll.answeredBy.includes(userId)) {
            console.error('User has already voted');
            return res.status(400).json({ message: 'User has already voted' });
        }

        votes.forEach(({ questionIndex, selectedOptionIndex }) => {
            const question = poll.questions[questionIndex];


            question.totalVotes += 1;
            if (selectedOptionIndex === question.correctAnswerIndex) {
                question.correctVotes += 1;
            }
        });

        poll.answeredBy.push(userId);

        await poll.save();
        res.status(200).json({ message: 'Votes submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting votes', error: error.message });
    }
}



router.get('/getAllPolls', verifyToken, getAllPolls);
router.get('/:id', verifyToken, getPollById);
router.post('/createPoll', verifyToken, createPoll);
router.delete('/deletePoll/:id', verifyToken, deletePoll);
router.post('/votePoll/:id', verifyToken, votePoll);

module.exports = router;
