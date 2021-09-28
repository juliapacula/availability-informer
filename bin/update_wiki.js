#! /app/.heroku/node/bin/node
const Date = require('../src/helpers/date');
const Calendar = require('../src/calendar/calendar');
const Wiki = require('../src/azure-wiki/wiki');

const date = new Date(Date.today);
const calendar = new Calendar(date);
const wiki = new Wiki(calendar);

wiki.updateWikiPage()
    .then(() => {
        process.exit();
    });
