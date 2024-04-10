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
async function updateUser(req, res) {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        let user = await Users.findById(id);

        if (!user) {
            return res.status(400).json({ msg: 'Korisnik ne postoji' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        if (password) {
            user.password = password;
        }

        await user.save();

        res.json({ msg: 'Korisnik je uspješno ažuriran' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        let user = await Users.findById(id);

        if (!user) {
            return res.status(400).json({ msg: 'Korisnik ne postoji' });
        }

        await Users.deleteOne({ _id: id });

        res.json({ msg: 'Korisnik je uspješno obrisan' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

router.post('/register', register);
router.post('/login', login);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;
