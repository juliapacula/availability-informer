const config = require('config');
const Date = require('../helpers/date');
const Markdown = require('./markdown');
const Page = require('./page');

module.exports = class Wiki {
    constructor(calendar) {
        this.calendar = calendar;
        this.date = calendar.getDate();
    }

    async updateWikiPage() {
        try {
            await this.getCurrentWeekPage();
            const newContent = await this.getUpdatedContent();
            await this.page.update(newContent);
        } catch (error) {
            console.error(error);
        }
    }

    async getCurrentWeekPage() {
        this.page = new Page(`${config.get('azure').documentPath}/${this.date.weekBoundaries}`);
        try {
            await this.page.get();
        } catch (error) {
            console.error(error);
            console.log('Taking content from a template.');
            await this.page.create();
        }
    }

    async getUpdatedContent() {
        const eventsGroup = await this.calendar.getGroupedEventsByDay(this.date.monday, this.date.friday);

        const row = await this.containingRow();

        if (!row) {
            throw Error('User was not found.');
        }

        const dayColumns = Markdown.getNodeChildren(row).slice(1);

        for (let day = 0; day < dayColumns.length; day++) {
            dayColumns[day].set_content(Date.parseDayEvents(eventsGroup[day]));
        }

        return Markdown.parseMarkdown(this.root.toString());
    }

    async containingRow() {
        const rows = await this.getRows();

        return rows.find((row) => {
            const columns = Markdown.getNodeChildren(row);

            return Markdown.getNodeText(columns[0]) === config.get('userName');
        });
    }

    /* This method currently only takes first found table.
     * In the future it should take this table where user is found */
    async getRows() {
        this.root = Markdown.parseHtml(this.page.content);

        return Markdown.getNodeChildren(this.root.querySelector('tbody'));
    }
};
