const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true },
    totalVotes: { type: Number, default: 0 },
    correctVotes: { type: Number, default: 0 },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Currencys', required: true },
    answeredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]
}, { timestamps: true });

module.exports = mongoose.model('Polls', pollSchema);
