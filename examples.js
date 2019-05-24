'use strict';
const Geocodio = require('./lib/geocodio');
require('dotenv').config();

const geocodio = new Geocodio({
    api_key: process.env.GEOCODIO_API_KEY, // YOUR_GEOCODIO_API_KEY (required)
    // base_endpoint: '', // Default - api.geocod.io
    // api_version: '',   // Default - v1.3
    // fields: ''         // Default - none. comma separated list of fields,
                          // see https://www.geocod.io/docs/#fields
});

/**
 *  Geocode GET example (single address)
 */
const address = '1600 Amphitheatre Parkway, Mountain View, CA 94043';
geocodio.get('geocode', address)
    .then(res => {
        // do stuff
    })
    .catch(err => { throw err; });

/**
 *  Geocode POST example the array way (batch of addresses)
 */
const addresses1 = [
    '1600 Amphitheatre Parkway, Mountain View, CA 94043',
    'One Microsoft Way, Redmond, WA 98052',
    'One Apple Park Way, Cupertino, CA 95014'
];
geocodio.post('geocode', addresses1)
    .then(res => {
        // do stuff
    })
    .catch(err => { throw err; });

/**
 *  Geocode POST example the JSON object way (batch of addresses)
 */
const addresses2 = {
    ADDRESS_ID1: '1600 Amphitheatre Parkway, Mountain View, CA 94043',
    ADDRESS_ID2: 'One Microsoft Way, Redmond, WA 98052',
    ADDRESS_ID3: 'One Apple Park Way, Cupertino, CA 95014'
};
geocodio.post('geocode', addresses2)
    .then(res => {
        // do stuff
    })
    .catch(err => { throw err; });

/**
 *  Reverse geocode GET example (single lat/long)
 */
const latlong = '37.422002,-122.084936';
geocodio.get('reverse', latlong)
    .then(res => {
        // do stuff
    })
    .catch(err => { throw err; });

/**
 *  Reverse geocode POST example (batch of lat/longs)
 */
const latlongs = [
    '37.422002,-122.084936',
    '52.303899,4.750026',
    '37.3312298,-122.011769'
];
geocodio.post('reverse', latlongs)
    .then(res => {
        // do stuff
    })
    .catch(err => { throw err; });
