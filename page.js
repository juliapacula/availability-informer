const Api = require('./api');
const { azure } = require('./calendar.config');

const BASE_URL = `https://dev.azure.com/${ azure.organizationName }/${ azure.teamProjectName }/_apis/wiki/wikis/${ azure.wikiName }/pages`;

module.exports = class Page {
  constructor(path) {
    this.path = path;
    this.api = new Api(`${ BASE_URL }?path=${ encodeURI(this.path) }`);
  }

  async get() {
    try {
      const response = await this.api.get('&includeContent=True&api-version=5.1');
      this.version = response.headers.get('ETag');

      const { id, content, url } = await response.json();
      this.id = id;
      this.content = content;
      this.url = url;
    } catch (error) {
      console.error('There was a error fetching page: \n' + error);
    }

    return this;
  }

  async update(content) {
    try {
      const response = await this.api.put(
        `&api-version=5.1`,
        { content },
        this.version,
      );

      console.log('Page updated correctly with status: ', response.status);
    } catch (error) {
      console.error('There was a error updating page: \n' + error);
    }
  }
};
