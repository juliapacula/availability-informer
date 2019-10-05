const moment = require('moment');

module.exports = class Date {
  constructor(date) {
    this.day = moment(date);
  }

  static get today() {
    return moment().toDate();
  }

  get monday() {
    return moment(this.day).weekday(1).startOf('day');
  }

  get mondayDate() {
    return this.monday.format('DD.MM');
  }

  get friday() {
    return moment(this.day).weekday(5).endOf('day');
  }

  get fridayDate() {
    return this.friday.format('DD.MM');
  }

  get weekBoundaries() {
    return `${this.mondayDate}-${this.fridayDate}`
  }

  static getTime(date) {
    return moment(date).format('HH:mm');
  }

  static getWeekday(date) {
    return moment(date).weekday();
  }

  static parseDayEvents(events) {
    let final = '';

    for (let event = 0; event < events.length; event++) {
      final += `${events[event].start}-${events[event].end}`;

      if (event !== events.length - 1) {
        final += '; ';
      }
    }

    return final;
  }
};
