const mongoose = require('mongoose');
const { hashPassword, matchPassword } = require('../middleware/registerMiddleware');

const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Currencys' }],
});

userSchema.pre('save', hashPassword);

userSchema.methods.matchPassword = matchPassword;

module.exports = mongoose.model('Users', userSchema);
