#!/usr/bin/env node

const Wiki = require('./wiki');
const Calendar = require('./calendar');
const Date = require('./date');

const date = new Date();
const calendar = new Calendar(date);
const wiki = new Wiki(calendar).updateWikiPage();
