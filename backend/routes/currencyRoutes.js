const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const currencyController = require('../controllers/currencyController');

router.get('/getAllCurrencies', currencyController.getAllCurrencies);
router.get('/:id', currencyController.getCurrencyById);
router.post('/createCurrency', verifyToken, currencyController.createCurrency);
router.post('/favoriteCurrency', verifyToken, currencyController.favoriteCurrency);
router.delete('/:id', verifyToken, currencyController.deleteCurrency);

module.exports = router;
