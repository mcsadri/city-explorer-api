'use strict';

// REQUIRES
const express =  require('express');
const cors = require('cors');
require('dotenv').config();
const fetchWeather = require('./modules/weather');
const fetchMovies = require('./modules/movies');
const isItMe = require('./modules/isItMe');

// SERVER
const app = express();

// MIDDLEWARE
app.use(cors());

// PORT
const PORT = process.env.PORT || 3002;

// ENDPOINTS
// home route
app.get('/', (request, response) => {
    response.send('Testing. 1, 2, 3?');
});
// weather route
app.get('/weather', fetchWeather);
// movie route
app.get('/movies', fetchMovies);
// route not found
app.use('*', isItMe);


// ERROR HANDLING middleware
// eslint-disable-next-line
// app.use((error, request, response, next) => {
//     console.log(error);
//     response.status(500).send(error);
// });

// LISTENER
app.listen(PORT, console.log(`listening on PORT ${PORT}`));
