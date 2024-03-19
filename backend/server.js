const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 4000;

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URL = `mongodb+srv://admin:${DB_PASSWORD}@cryptowebapp.xbnscvx.mongodb.net/?retryWrites=true&w=majority&appName=CryptoWebApp`;


MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Greška prilikom povezivanja s MongoDB bazom podataka:', err);
        return;
    }

    console.log('Povezano s MongoDB bazom podataka');
    const db = client.db();

    app.get('/', (req, res) => {
        res.send('Hello MEAN Stack!');
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
