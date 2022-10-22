'use strict';

const axios = require('axios');
const cache = require('./cache.js');

function fetchWeather(request, response) {
    const {lat, lon} = request.query;
    const key = 'weather-' + lat + lon;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=7`;
    console.log('fetchWeather url: ', url);

    if (cache[key] && (Date.now() - cache[key].timestamp < 3600000)) { // 1 hour
        console.log('fetchWeather() cache hit ');
        response.status(200).send(cache[key]);
    } else {
        console.log('fetchWeather() cache miss');
        cache[key] = {};
        axios
            .get(url)
            .then(weatherResponse => {
                cache[key].timestamp = Date.now();
                cache[key].date = Date().toLocaleString();
                const cityName = weatherResponse.data.city_name + ', ' + weatherResponse.data.country_code;
                const forecasts = weatherResponse.data.data.map(day => new Weather(day, cityName, cache[key].date));
                cache[key] = forecasts;
                response.status(200).send(cache[key]);
            })
            .catch (error => {
                console.error('fetchWeather() axios error: ', error);
                response.status(500).send('fetchWeather server error: ', error);
            });
    }

    return cache[key].data;
}

class Weather {
    constructor(day, cityName, date){
        this.id = day.sunrise_ts;
        this.cityName = cityName;
        this.dateTime = day.datetime;
        this.description = day.weather.description;
        this.lowTemp = day.low_temp + ' °C';
        this.highTemp = day.high_temp + ' °C';
        this.cacheDate = date;
    }
}

module.exports = fetchWeather;
