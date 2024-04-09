const express = require('express');
const router = express.Router();
const Users = require('../models/UserModel');
const jwt = require('jsonwebtoken');

async function register(req, res) {
    const { username, email, password } = req.body;

    try {
        let user = await Users.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'Korisnik već postoji' });
        }

        user = new Users({
            username,
            email,
            password,
        });

        await user.save();

        res.json({ msg: 'Korisnik je uspješno registriran' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        let user = await Users.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Korisnik ne postoji' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Pogrešna lozinka' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ msg: 'Korisnik je uspješno prijavljen', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

router.post('/register', register);
router.post('/login', login);

module.exports = router;
