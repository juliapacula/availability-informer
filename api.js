const fetch = require('node-fetch');

const { personalAccessToken } = require('./auth');

module.exports = class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(url) {
    return await fetch(this.baseUrl + encodeURI(url), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ personalAccessToken }`,
      },
    });
  }

  async put(url, body, etag) {
    return await fetch(this.baseUrl + url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'If-Match': etag,
        'Authorization': `Basic ${ personalAccessToken }`,
      },
    });
  }
};
