'use strict';

const axios = require('axios');
const cache = require('./cache.js');

function fetchMovies(request, response) {
    const searchQuery = request.query;
    const key = 'movie-'+ searchQuery;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${request.query.searchQuery}&page=1`;
    console.log('featchMovies url: ', url);

    if (cache[key] && (Date.now() - cache[key].timestamp < 86400000) && cache[key].searchQuery == searchQuery) { // eslint-disable-line
        console.log('fetchMovie() cache hit ');
        response.status(200).send(cache[key]);
    } else {
        console.log('fetchMovies() cache miss');
        cache[key] = {};
        axios
            .get(url)
            .then(movieResponse => {
                cache[key].timestamp = Date.now();
                cache[key].date = Date().toLocaleString();
                const movies = movieResponse.data.results.map(movie => new Movie(movie, cache[key].date));
                cache[key] = movies;
                cache[key].searchQuery = searchQuery;
                response.status(200).send(cache[key]);
            })
            .catch (error => {
                console.error('fetchMovies axios error: ', error);
                response.status(500).send('fetchMovies server error: ', error);
            });
    }

    return cache[key].data;
}

class Movie {
    constructor(movie, date){
        this.id = movie.id;
        this.title = movie.title;
        this.overview = movie.overview.substring(0, 100) + '...';
        this.average_votes = movie.vote_average;
        this.total_votes = movie.vote_count;
        this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        this.popularity = movie.popularity;
        this.released_on = movie.release_date;
        this.cacheDate = date;
    }
}

module.exports = fetchMovies;
