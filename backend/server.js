const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const postRoutes = require('./routes/PostRoutes');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/currencies', currencyRoutes);
app.use('/api/posts', postRoutes);

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
