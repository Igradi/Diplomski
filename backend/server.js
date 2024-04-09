const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 4000;

app.use(express.json());
app.use('/api/users', userRoutes);

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URL = `mongodb+srv://admin:${DB_PASSWORD}@cryptowebapp.xbnscvx.mongodb.net/?retryWrites=true&w=majority&appName=CryptoWebApp`;

mongoose.connect(DB_URL)
    .then(() => {
        console.log('Povezano s MongoDB bazom podataka');

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Greška prilikom povezivanja s MongoDB bazom podataka:', err);
    });
