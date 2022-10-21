'use strict';

const axios = require('axios');
const cache = require('./cache.js');

function fetchWeather(request, response) {
    const {lat, lon} = request.query;
    const key = 'weather-' + lat + lon;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=1`;
    console.log('fetchWeather url: ', url);

    console.log('Date.now: ', Date.now());
    if (cache[key] && (Date.now() - cache[key].timestamp < 3600000)) { // 1 hour
        console.log('fetchWeather() cache hit ');
        // console.log('cache[key].timestamp: ', cache[key].timestamp);
        console.log('weather cache age: ', (Date.now() - cache[key].timestamp));
        response.status(200).send(cache[key]);
    } else {
        console.log('fetchWeather() cache miss');
        cache[key] = {};
        cache[key].timestamp = Date.now();
        axios
            .get(url)
            .then(weatherResponse => {
                // console.log('weatherResponse.data: ', weatherResponse.data);
                const forecasts = weatherResponse.data.data.map(day => new Weather(day));
                cache[key] = forecasts;
                cache[key].timestamp = Date.now();
                // console.log('weather cache: ', cache[key]);
                response.status(200).send(cache[key]);
            })
        // cache[key].data = axios
        //     .get(url)
        //     .then(weatherResponse => {
        //         console.log('weatherResponse.data: ', weatherResponse.data);
        //         parseWeather(weatherResponse.data);
        //         cache[key].timestamp = Date.now();
        //         console.log('weather cache: ', cache[key]);
        //         response.status(200).send(cache[key]);
        //     })
            .catch (error => {
                console.error('fetchWeather axios error: ', error);
                response.status(500).send('fetchWeather server error: ', error);
            });
    }
    return cache[key].data;
}

// function parseWeather(weatherData) {
//     try {
//         const weatherSummaries = weatherData.data.map(day => {
//             return new Weather(day);
//         });
//         return Promise.resolve(weatherSummaries);
//     } catch (e) {
//         return Promise.reject(e);
//     }
// }

class Weather {
    constructor(day){
        this.id = day.sunrise_ts;
        this.date = day.datetime;
        this.description = day.weather.description;
        this.lowTemp = day.low_temp + ' °C';
        this.highTemp = day.high_temp + ' °C';
    }
}

module.exports = fetchWeather;
