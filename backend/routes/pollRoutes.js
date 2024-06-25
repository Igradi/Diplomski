const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const pollController = require('../controllers/pollController');

router.get('/getAllPolls', verifyToken, pollController.getAllPolls);
router.get('/:id', verifyToken, pollController.getPollById);
router.post('/createPoll', verifyToken, pollController.createPoll);
router.delete('/deletePoll/:id', verifyToken, pollController.deletePoll);
router.post('/votePoll/:id', verifyToken, pollController.votePoll);

module.exports = router;
