/**
Copyright (c) 2019 Tony S. Tosi
Permission is hereby granted, free of charge, to any person
obtaining a copy of this Software and associated documentation
files (the “Software”), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify,
This is the Title of the Book, eMatter Edition Copyright © 2004
O’Reilly & Associates, Inc. All rights reserved. The BSD License |
15 merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.
*/
'use strict'
const https = require('https');     // https://nodejs.org/dist/latest-v6.x/docs/api/https.html
const qs = require('querystring');  // https://nodejs.org/dist/latest-v6.x/docs/api/querystring.html
const _request = Symbol('request'); // make request method private

/**
 * @desc methods for GET and POST requests to the geocod.io API
 * @param {Object} config - geocodio configuration object (see constructor)
 */
module.exports = class Geocodio {
    constructor(config) {
        if (!config.api_key) throw 'API key is required';
        Object.assign(this, {
            base_endpoint: 'api.geocod.io',
            api_version: 'v1.3',
            api_key: '',
            fields: '',
        }, config);
    };

    /**
     * @desc Peforms a single address lookup
     * @param string lookupType - the type of lookup; either geocode or reverse
     * @param string address - a single address (to geocode) or at lat/long (to reverse)
     * @return {Promise<{Object}>} - the geocoded or reverse geocoded address
     * @see {@link https://www.geocod.io/docs/#single-address}
    */
    get(lookupType = 'geocode', address) {
        return new Promise((resolve, reject) => {
            this[_request](lookupType, address, 'GET')
                .then(res => {
                    resolve(JSON.parse(res));
                })
                .catch(err => reject(err));
        });
    };

    /**
     * @desc Peforms a batch of address lookups
     * @param {string} lookupType - the type of lookup; either geocode or reverse
     * @param {Array} addresses - an array (or object) of addresses or lat/long values
     * @returns {Promise<{Object}>} - the geocoded or reverse geocoded addresses
     * @see {@link https://www.geocod.io/docs/#batch-geocoding}
    */
    post(lookupType = 'geocode', addresses) {
        return new Promise((resolve, reject) => {
            this[_request](lookupType, addresses, 'POST')
                .then(res => {
                    resolve(JSON.parse(res));
                })
                .catch(err => reject(err));
        });
    };

    [_request](lookupType, data, method) {
        return new Promise((resolve, reject) => {
            // build query string used for both GET and POST requests
            data = method === 'POST' ? JSON.stringify(data) : data;
            const queryString = qs.stringify({
                api_key: this.api_key,
                fields: this.fields,
                q: method === 'GET' ? data : ''
            });

            // configure HTTPS request options
            const options = {
                hostname: this.base_endpoint,
                port: 443,
                path: `/${this.api_version}/${lookupType}?${queryString}`,
                method: method,
                headers: method === 'POST' ? {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                } : '' // don't need header for GET
            };

            // make call to geocod.io API and process response
            const request = https.request(options, response => {
                let responseData = '';
                response.setEncoding('utf8');
                response.on('data', chunk => {
                    responseData += chunk;
                });
                response.on('end', () => resolve(responseData));
            });

            request.on('error', err => reject(err));
            request.write(method === 'POST' ? data : '');
            request.end();
        });
    };
};