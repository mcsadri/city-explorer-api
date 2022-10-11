'use strict';

// requires
const express =  require('express');
const cors = require('cors');
require('dotenv').config();
const weather = require('./data/weather.json');

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
app.get('/weather', (req, res) => {
    // get searchQuery from the request object
    const city = req.query.city;
    console.log('query parameter: ', req.query);
    console.log('type: ', city);
    res.send('testing weather endpoint', city);
});

// classes
class Forecast {
    constructor(city){
        // method to find city forecast
        let{city_name, data} = weather.data.find(data => data.city_name === city);
        this.city = city_name;
        this.data = data;
    }
    // method to get lat and lon
    // getCoordinates(){
    //     return this.
    // }

}

// port listener
app.listen(PORT, console.log(`listening on PORT ${PORT}`));
