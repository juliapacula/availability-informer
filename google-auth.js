const fs = require('fs');
const { google } = require('googleapis');
const readline = require('readline');

const { googleToken } = require('./auth');

module.exports = class GoogleAuth {
  constructor() {
    this.authorize();
  }

  authorize() {
    this.oAuth2Client = new google.auth.OAuth2(
      googleToken.clientId,
      googleToken.clientSecret,
      googleToken.redirectUris[0],
    );

    const token = fs.readFileSync('token.json');

    if (token) {
      this.oAuth2Client.setCredentials(JSON.parse(token).tokens);
    } else {
      this.getAccessToken();
    }
  }

  getAccessToken() {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: googleToken.scope,
    });

    console.log('Authorize this app by visiting: ', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the code from auth page: ', (code) => {
      rl.close();
      this.oAuth2Client.getToken(code).then(({ tokens }) => {
        this.oAuth2Client.setCredentials(tokens);
        fs.writeFile('./token.json', JSON.stringify(token), (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('Token stored to ./token.json');
          }
        });

        return this.oAuth2Client;
      }).catch(error => {
        console.error('Error accessing a auth token: \n' + error);
      });
    })
  }
};
