'use strict';

// requires
const express =  require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

// Express server instance
const app = express();

// middleware
app.use(cors());

// PORT variable
const PORT = process.env.PORT || 3002;

// endpoints
// home route
app.get('/', (request, response) => {
    response.send('Testing. 1, 2, 3?');
});
// weather route
app.get('/weather', async (request, response, next) => {
    try {
        const lat = Number(request.query.lat);
        const lon = Number(request.query.lon);
        // or alternatively we could do the same with destructing: const{lat, lon} = request.query;
        const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&units=M&days=7&lat=${lat}&lon=${lon}`;
        const weatherResponse = await axios.get(weatherUrl);
        console.log(weatherResponse.data);
        const forecasts = weatherResponse.data.data.map(day => new Forecast(day));
        // send forecasts array back
        response.status(200).send(forecasts);
    } catch(error) {
        next(error.message);
    }
});

// classes
class Forecast {
    constructor(day){
        this.id = day.sunrise_ts;
        this.date = day.datetime;
        this.description = day.weather.description;
        this.lowTemp = day.low_temp + ' °C';
        this.highTemp = day.high_temp + ' °C';
    }
}

// middleware for error handling
// eslint-disable-next-line
app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send(error);
});

// port listener
app.listen(PORT, console.log(`listening on PORT ${PORT}`));
