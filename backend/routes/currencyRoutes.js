const express = require('express');
const router = express.Router();
const Currency = require('../models/CurrencyModel');
const User = require('../models/UserModel');
const verifyToken = require('../middleware/verifyToken');

async function getCurrencyById(req, res) {
    const { id } = req.params;

    try {
        const currency = await Currency.findById(id);

        if (!currency) {
            return res.status(404).json({ msg: 'Currency not found' });
        }

        res.json(currency);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

async function getAllCurrencies(req, res) {
    try {
        const currencies = await Currency.find({});
        res.json(currencies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

async function createCurrency(req, res) {
    const { name, abbreviation } = req.body;

    try {
        const existingCurrency = await Currency.findOne({ abbreviation });

        if (existingCurrency) {
            return res.status(400).json({ msg: 'Currency already exists' });
        }

        const newCurrency = new Currency({
            name,
            abbreviation
        });

        await newCurrency.save();

        res.json({ msg: 'Currency created', currency: newCurrency });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

async function favoriteCurrency(req, res) {
    const { userId, currencyId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const currency = await Currency.findById(currencyId);
        if (!currency) {
            return res.status(404).json({ msg: 'Currency not found' });
        }

        const index = user.favorites.indexOf(currencyId);
        if (index !== -1) {
            user.favorites.splice(index, 1);
            await user.save();
            return res.json({ msg: 'Currency removed from favorites', currency, user });
        }

        user.favorites.push(currencyId);
        await user.save();

        res.json({ msg: 'Currency added to favorites', currency, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

async function deleteCurrency(req, res) {
    const { id } = req.params;

    try {
        const currency = await Currency.findById(id);

        if (!currency) {
            return res.status(404).json({ msg: 'Currency not found' });
        }

        await Currency.deleteOne({ _id: id });

        res.json({ msg: 'Currency deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}



router.get('/getAllCurrencies', getAllCurrencies);
router.get('/:id', getCurrencyById);
router.post('/createCurrency', verifyToken, createCurrency);
router.post('/favoriteCurrency', verifyToken, favoriteCurrency);
router.delete('/:id', verifyToken, deleteCurrency);

module.exports = router;
