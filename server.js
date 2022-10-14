'use strict';

// REQUIRES
const express =  require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

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

// movie route
app.get('/movies', async (request, response, next) => {
    try {
        const searchQuery = request.query.searchQuery;
        const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${searchQuery}&page=1`;
        const movieResponse = await axios.get(movieUrl);
        console.log(movieResponse.data);
        const movies = movieResponse.data.results.map(movie => new Movie(movie));
        response.status(200).send(movies);
    } catch(error) {
        next(error.message);
    }
});

// CLASSES
class Forecast {
    constructor(day){
        this.id = day.sunrise_ts;
        this.date = day.datetime;
        this.description = day.weather.description;
        this.lowTemp = day.low_temp + ' °C';
        this.highTemp = day.high_temp + ' °C';
    }
}
class Movie {
    constructor(movie){
        this.id = movie.id;
        this.title = movie.title;
        this.overview = movie.overview.substring(0, 150) + '...';
        this.average_votes = movie.vote_average;
        this.total_votes = movie.vote_count;
        this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        this.popularity = movie.popularity;
        this.released_on = movie.release_date;
    }
}

// ERROR HANDLING middleware
// eslint-disable-next-line
app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send(error);
});

// LISTENER
app.listen(PORT, console.log(`listening on PORT ${PORT}`));
