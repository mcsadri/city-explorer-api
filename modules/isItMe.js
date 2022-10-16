'use strict';

function isItMe(request, response) {
    console.log('route not found');
    response.status(404).send('That endpoint doesn\'t exist. www.youtube.com/watch?v=AiC7ZX5K9L');
}

module.exports = isItMe;
