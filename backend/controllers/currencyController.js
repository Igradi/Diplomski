const Currency = require('../models/CurrencyModel');
const User = require('../models/UserModel');

exports.getCurrencyById = async (req, res) => {
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
};

exports.getAllCurrencies = async (req, res) => {
    try {
        const currencies = await Currency.find({});
        res.json(currencies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.createCurrency = async (req, res) => {
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
};

exports.favoriteCurrency = async (req, res) => {
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
};

exports.deleteCurrency = async (req, res) => {
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
};
