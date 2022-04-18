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
                describe: 'Date in the week to be updated, eg. "04-10-2021"',
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
    .command('count', 'Count number of working hours in a week.', (yargs) => {
        yargs
            .option('date', {
                alias: 'd',
                describe: 'Date in the week to be updated, eg. "04-10-2021"',
                default: Date.today,
                type: 'string',
            })
            .option('workingHours', {
                alias: 'w',
                describe: 'Number of working hours in the month',
                default: 168,
                type: 'number',
            })
            .help();
    }, (argv) => {
        const date = new Date(argv.date);
        const calendar = new Calendar(date);

        calendar.countHoursInWeek()
            .then((hours) => {
                console.log(`In the month ${date.monthName} you will work ${hours} hours. That is ${hours / argv.workingHours * 100}% of regular work shift.`);
            });
    })
    .help()
    .argv;
