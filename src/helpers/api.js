const config = require('config');
const fetch = require('node-fetch');

module.exports = class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async get(url) {
        return await fetch(this.baseUrl + encodeURI(url), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${this.encodePAT()}`,
            },
        });
    }

    async put(url, body, etag) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${this.encodePAT()}`,
        };

        if (etag) {
            headers['If-Match'] = etag;
        }

        return await fetch(this.baseUrl + url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers,
        });
    }

    encodePAT() {
        return new Buffer.from(`:${config.get('googleAuth.personalAccessToken')}`).toString('base64');
    }
};
