'use strict';

const axios = require('axios');

function fetchWeather(request, response) {
    console.log('lat & lon: ', request.query.lat, ' ', request.query.lon);
    const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&units=M&days=7&lat=${request.query.lat}&lon=${request.query.lon}`;
    axios
        .get(weatherUrl)
        .then(weatherResponse => {
            console.log(weatherResponse.data);
            const forecasts = weatherResponse.data.data.map(day => new Forecast(day));
            response.status(200).send(forecasts);
        })
        .catch (error => {
            console.error('fetchWeather axios error: ', error);
            response.status(500).send('fetchWeather server error: ', error);
            // next(error.message);
        });
}

class Forecast {
    constructor(day){
        this.id = day.sunrise_ts;
        this.date = day.datetime;
        this.description = day.weather.description;
        this.lowTemp = day.low_temp + ' °C';
        this.highTemp = day.high_temp + ' °C';
    }
}

module.exports = fetchWeather;
