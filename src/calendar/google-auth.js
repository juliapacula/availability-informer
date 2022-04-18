const config = require('config');
const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');
const readlineSync = require('readline-sync');
const cp = require('child_process');

module.exports = class GoogleAuth {
    constructor() {
        this.authorize();
    }

    authorize() {
        this.oAuth2Client = new google.auth.OAuth2(
            config.get('googleAuth.googleToken.clientId'),
            config.get('googleAuth.googleToken.clientSecret'),
            config.get('googleAuth.googleToken.redirectUris')[0],
        );

        let token = {...config.get('googleOAuthToken')};

        if (!token) {
            this.getAccessToken()
                .then(t => {
                    token = t;
                });
        }

        this.login(token);
    }

    login(token) {
        this.oAuth2Client.setCredentials(token);
    }

    async getAccessToken() {
        console.log('Getting new access token.');
        const authUrl = this.generateAuthUrl();
        const code = await this.readCodeFrom(authUrl);
        const {tokens} = await this.oAuth2Client.getToken(code);
        this.saveToken(tokens);

        return tokens;
    }

    generateAuthUrl() {
        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: config.get('googleAuth.googleToken.scope'),
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
