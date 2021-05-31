const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readlineSync = require('readline-sync');
const cp = require('child_process');

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

    let token;
    try {
      const file = fs.readFileSync(path.resolve(__dirname, 'token.json'));
      token = JSON.parse(file);
    } catch {
      this.getAccessToken().then(t => {
        token = t;
      });
    } finally {
      this.login(token);
    }
  }

  login(token) {
    this.oAuth2Client.setCredentials(token);
  }

  async getAccessToken() {
    const authUrl = this.generateAuthUrl();
    const code = await this.readCodeFrom(authUrl);
    const { tokens } = await this.oAuth2Client.getToken(code);
    this.saveToken(tokens);

    return tokens;
  }

  generateAuthUrl() {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: googleToken.scope,
    });
  }

  async readCodeFrom(url) {
    console.log('Authorize this app by visiting: ', url);

    if (process.platform === 'win32') {
      cp.execSync(`start chrome "${url}"`);
    } else {
      cp.execSync(`chromium-browser "${url}"`);
    }

    return readlineSync.question('Enter the code from the browser: \n');
  }

  saveToken(token) {
    fs.writeFileSync(path.resolve(__dirname, 'token.json'), JSON.stringify(token));
    console.log('Token stored to ' + path.resolve(__dirname, 'token.json'));
  }
};
