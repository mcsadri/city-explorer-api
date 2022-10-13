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
app.get('/weather', (request, response, next) => {
    try {
        // const lat = request.query.lat;
        // const lon = request.query.lon;
        const searchQuery = request.query.searchQuery;
        // or alternatively we could do the same with  destructing:
        //  const{lat, lon, searchQuery} = request.query;
        const forecast = new Forecast(searchQuery);
        const forecasts = forecast.getForecast();
        // send forecasts array back
        response.status(200).send(forecasts);
    } catch(error) {
        next(error.message);
    }
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

// middleware for error handling
// eslint-disable-next-line
app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send(error);
});

// port listener
app.listen(PORT, console.log(`listening on PORT ${PORT}`));
