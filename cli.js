#!/usr/bin/env node

const yargs = require('yargs');

const Wiki = require('./src/azure-wiki/wiki');
const Calendar = require('./src/calendar/calendar');
const Date = require('./src/helpers/date');

const argv = yargs
  .command('update', 'Updates table with events fetched from the calendar', (yargs) => {
    yargs
      .option('date', {
        alias: 'd',
        describe: 'Date in the week to be updated',
        default: Date.today,
        type: 'string',
      })
      .help();
  }, (argv) => {
    const date = new Date(argv.date);
    const calendar = new Calendar(date);
    const wiki = new Wiki(calendar);

    wiki.updateWikiPage().then();
  })
  .help()
  .argv;
