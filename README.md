# nodejs-geocodio
A nodejs library for accessing the [geocod.io](https://www.geocod.io/) API service.

### Installation
    npm i --save nodejs-geocodio

### Usage
See https://www.geocod.io/docs/ for full documentation.

##### Configuration

It is strongly suggested to store your API key in an external file, e.g. using [dotenv](https://github.com/motdotla/dotenv).

```javascript
const geocodio = new Geocodio({
    api_key: process.env.GEOCODIO_API_KEY, // YOUR_GEOCODIO_API_KEY (required)
    // base_endpoint: '', // Defaults to api.geocod.io
    // api_version: '',   // Defaults to v1.3
    // fields: ''         // Defaults to none - a comma separated list of fields
});
```
See https://www.geocod.io/docs/#fields for more information on available fields.


### Examples
##### Forward Geocoding
```javascript
/**
 *  Geocode GET example (single address)
 */
const address = '1600 Amphitheatre Parkway, Mountain View, CA 94043';
geocodio.get('geocode', address)
    .then(res => {
        // do stuff
    })
    .catch(err => { throw err; });
```
See https://www.geocod.io/docs/#single-address for documentation


```javascript
/**
 *  Geocode POST example, the array way (batch of addresses)
 */
const addresses = [
    '1600 Amphitheatre Parkway, Mountain View, CA 94043',
    'One Microsoft Way, Redmond, WA 98052',
    'One Apple Park Way, Cupertino, CA 95014'
];
geocodio.post('geocode', addresses)
    .then(res => {
        // do stuff
    })
    .catch(err => { throw err; });
```
See https://www.geocod.io/docs/#batch-geocoding for documentation


```javascript
/**
 *  Geocode POST example, the JSON object way (batch of addresses)
 */
const addresses = {
    ADDRESS_ID1: '1600 Amphitheatre Parkway, Mountain View, CA 94043',
    ADDRESS_ID2: 'One Microsoft Way, Redmond, WA 98052',
    ADDRESS_ID3: 'One Apple Park Way, Cupertino, CA 95014'
};
geocodio.post('geocode', addresses)
    .then(res => {
        // do stuff
    })
    .catch(err => { throw err; });
```
See https://www.geocod.io/docs/#batch-geocoding for documentation


##### Reverse Geocoding
```javascript
/**
 *  Reverse geocode GET example (single lat/long)
 */
const latlong = '37.422002,-122.084936';
geocodio.get('reverse', latlong)
    .then(res => {
        // do stuff
    })
    .catch(err => { throw err; });
```
See https://www.geocod.io/docs/#reverse-geocoding-single-coordinate for documentation


```javascript
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
```
See https://www.geocod.io/docs/#batch-reverse-geocoding for documentation


***

MIT License (MIT)

Copyright :copyright: 2019 Tony S. Tosi

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
