'use strict';

// requires
const express =  require('express');
const cors = require('cors');
require('dotenv').config();
const weatherData = require('./data/weather.json');

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
// weather data
app.get('/weather', (request, response) => {
    const lat = request.query.lat;
    const lon = request.query.lon;
    const searchQuery = request.query.searchQuery;
    // or alternatively we could do the same with  destructing:
    // const{lat, lon, searchQuery} = request.query;
    const forecast = new Forecast(searchQuery);
    const forecastArray = forecast.getForecast();
    // send forecast Array back
    response.status(200).send(forecastArray);
});

// classes
class Forecast {
    constructor(userCity){
        let {data} = weatherData.find(city => city.city_name.toLowerCase() === userCity.toLowerCase());
        this.data = data;
    }

    getForecast() {
        return this.data.map(day => ({
            date: day.datetime,
            description: day.weather.description,
        }));
    }
}

// port listener
app.listen(PORT, console.log(`listening on PORT ${PORT}`));
