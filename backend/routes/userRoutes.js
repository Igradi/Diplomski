const express = require('express');
const router = express.Router();
const Users = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

async function register(req, res) {
    try {
        const newUser = new Users(req.body);

        await newUser.save();

        res.json({ msg: 'User created' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        let user = await Users.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Wrong password' });
        }

        const tokenPayload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ msg: 'User logged in successfully', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

async function updateUser(req, res) {
    const { id } = req.params;
    const { username, email, currentPassword, newPassword, role } = req.body;

    try {
        let user = await Users.findById(id);

        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;

        if (currentPassword && newPassword) {
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Current password is incorrect' });
            }
            user.password = newPassword;
        }

        await user.save();

        res.json({ msg: 'User updated', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        let user = await Users.findById(id);

        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        await Users.deleteOne({ _id: id });

        res.json({ msg: 'User deleted', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await Users.find({});
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

async function getUserById(req, res) {
    const { id } = req.params;

    try {
        const user = await Users.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

router.post('/register', register);
router.post('/login', login);
router.put('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/getAllUsers', verifyToken, getAllUsers);
router.get('/getUserById/:id', verifyToken, getUserById);

module.exports = router;
