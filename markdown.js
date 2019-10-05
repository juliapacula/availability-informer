const { parse, HTMLElement } = require('node-html-parser');
const showdown = require('showdown');
const TurndownService = require('turndown');
const turndownPluginGfm = require('turndown-plugin-gfm');

const gfm = turndownPluginGfm.gfm;
const converter = new showdown.Converter({
  tables: true,
});

module.exports = class Markdown {
  static parseHtml(markdown) {
    return parse(converter.makeHtml(markdown));
  }

  static parseMarkdown(html) {
    return new TurndownService({ headingStyle: 'atx' }).use(gfm).turndown(html);
  }

  static getNodeChildren(htmlNode) {
    return htmlNode.childNodes.filter(r => r instanceof HTMLElement);
  }

  static getNodeText(htmlNode) {
    return htmlNode.firstChild.rawText;
  }
};
