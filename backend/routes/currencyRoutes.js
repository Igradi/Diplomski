const express = require('express');
const router = express.Router();
const Currency = require('../models/CurrencyModel');

async function getCurrencyById(req, res) {
    const { id } = req.params;

    try {
        const currency = await Currency.findById(id);

        if (!currency) {
            return res.status(404).json({ msg: 'Currency nije pronađen' });
        }

        res.json(currency);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function getAllCurrencies(req, res) {
    try {
        const currencies = await Currency.find({});
        res.json(currencies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

async function createCurrency(req, res) {
    const { name, abbreviation } = req.body;

    try {
        const existingCurrency = await Currency.findOne({ abbreviation });

        if (existingCurrency) {
            return res.status(400).json({ msg: 'Valuta s tom kraticom već postoji' });
        }

        const newCurrency = new Currency({
            name,
            abbreviation
        });

        await newCurrency.save();

        res.json({ msg: 'Nova valuta je uspješno dodana', currency: newCurrency });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Greška na serveru');
    }
}

router.get('/:id', getCurrencyById);
router.get('/getAllCurrencies', getAllCurrencies);
router.post('/createCurrency', createCurrency);

module.exports = router;
