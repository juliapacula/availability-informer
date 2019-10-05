const Api = require('./api');
const { azure } = require('./calendar.config');

const BASE_URL = `https://dev.azure.com/${ azure.organizationName }/${ azure.teamProjectName }/_apis/wiki/wikis/${ azure.wikiName }/pages`;

module.exports = class Page {
  constructor(path) {
    this.path = path;
    this.api = new Api(`${ BASE_URL }?path=${ encodeURI(this.path) }`);
  }

  async get() {
    const response = await this.api.get('&includeContent=True&api-version=5.1');

    if (response.status === 404) {
      throw new Error('Page was not found.');
    }

    if (!response.ok) {
      throw new Error('Unable to fetch page.');
    }

    this.version = response.headers.get('ETag');

    const { id, content, url } = await response.json();
    this.id = id;
    this.content = content;
    this.url = url;

    return this;
  }

  async update(content) {
    try {
      const response = await this.api.put(
        `&api-version=5.1`,
        { content },
        this.version,
      );

      if (response.status === 201) {
        console.log('Page was created.');
      } else if (response.status === 200) {
        console.log('Page was updated.');
      } else {
        throw new Error(`Update status: ${response.status} - ${response.statusText}`)
      }
    } catch (error) {
      console.error('There was a error updating page: \n' + error);
    }
  }

  async create() {
    const template = new Page(`${ azure.documentTemplatePath }`);
    await template.get();

    this.content = template.content;
  }
};
