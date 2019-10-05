const Calendar = require('./calendar');
const { userName, azure } = require('./calendar.config');
const Date = require('./date');
const Markdown = require('./markdown');
const Page = require('./page');

module.exports = class Wiki {
  constructor(date) {
    this.date = date || new Date();
    this.calendar = new Calendar();
  }

  async getCurrentWeekPage() {
    this.page = new Page(`${ azure.documentPath }/${ this.date.weekBoundaries }`);
    await this.page.get();
  }

  /* This method currently only takes first found table.
   * In the future it should take this table where user is found */
  async getRows() {
    await this.getCurrentWeekPage();
    this.root = Markdown.parseHtml(this.page.content);

    return Markdown.getNodeChildren(this.root.querySelector('tbody'));
  }

  async containingRow() {
    const rows = await this.getRows();

    return rows.find((row) => {
      const columns = Markdown.getNodeChildren(row);

      return Markdown.getNodeText(columns[0]) === userName;
    });
  }

  async getUpdatedContent() {
    const eventsGroup = await this.calendar.getGroupedEventsByDay(this.date.monday, this.date.friday);

    const row = await this.containingRow();
    const dayColumns = Markdown.getNodeChildren(row).slice(1);

    for (let day = 0; day < dayColumns.length; day++) {
      dayColumns[day].set_content(Date.parseDayEvents(eventsGroup[day]));
    }

    return Markdown.parseMarkdown(this.root.toString());
  }

  async updateWikiPage() {
    const newContent = await this.getUpdatedContent();
    await this.page.update(newContent);
  }
};
