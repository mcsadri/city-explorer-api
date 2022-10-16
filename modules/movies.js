'use strict';

const axios = require('axios');

function fetchMovies(request, response) {
    console.log('searchQuery: ', request.query.searchQuery);
    const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${request.query.searchQuery}&page=1`;
    axios
        .get(movieUrl)
        .then(movieResponse => {
            console.log(movieResponse.data);
            const movies = movieResponse.data.results.map(movie => new Movie(movie));
            response.status(200).send(movies);
        })
        .catch(error => {
            console.error('fetchMovies axios error: ', error);
            response.status(500).send('fetchMovies server error: ', error);
            // next(error.message);
        });
}

class Movie {
    constructor(movie){
        this.id = movie.id;
        this.title = movie.title;
        this.overview = movie.overview.substring(0, 100) + '...';
        this.average_votes = movie.vote_average;
        this.total_votes = movie.vote_count;
        this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        this.popularity = movie.popularity;
        this.released_on = movie.release_date;
    }
}

module.exports = fetchMovies;
