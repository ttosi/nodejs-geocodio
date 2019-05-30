/**
Copyright (c) 2019 Tony S. Tosi

Permission to use, copy, modify, and/or distribute this
software for any purpose with or without fee is hereby granted,
provided that the above copyright notice and this permission
notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE 
AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL
DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA
OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
*/
'use strict'
const https = require('https');     // https://nodejs.org/dist/latest-v6.x/docs/api/https.html
const qs = require('querystring');  // https://nodejs.org/dist/latest-v6.x/docs/api/querystring.html
const _request = Symbol('request'); // make request method private

/**
 * @desc Helper methods for GET and POST requests to the geocod.io API
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
     * @param string address - a single address (to geocode) or a lat/long (to reverse)
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
     * @param {Array} addresses - an array (or object list) of addresses or lat/long values
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
            // stringigy the payload if it's a POST
            data = method === 'POST' ? JSON.stringify(data) : data;

            // build query string used for both GET and POST requests
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
                } : '' // don't need to add headers for GET
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
