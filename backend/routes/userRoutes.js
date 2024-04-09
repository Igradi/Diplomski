const express = require('express');
const router = express.Router();
const Users = require('../models/UserModel');

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

router.post('/register', register);

module.exports = router;
