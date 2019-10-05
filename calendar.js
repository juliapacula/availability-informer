const { google } = require('googleapis');
const GoogleAuth = require('./google-auth');
const Date = require('./date');
const { eventType, workCalendar } = require('./calendar.config');

module.exports = class Calendar {
  constructor(date) {
    this.auth = new GoogleAuth();
    this.calendar = google.calendar({ version: 'v3', auth: this.auth.oAuth2Client });
    this.date = date || new Date();
  }

  static getEventStart(event) {
    return event.start.dateTime;
  }

  static getEventEnd(event) {
    return event.end.dateTime;
  }

  getDate() {
    return this.date;
  }

  async getCalendars() {
    const calendarsSchema = await this.calendar.calendarList.list();

    return calendarsSchema.data.items;
  }

  async getWorkCalendar() {
    const allCalendars = await this.getCalendars();

    return allCalendars.filter(c => c.summary === workCalendar)[0];
  }

  async getOfficeEvents(start, end) {
    const { id } = await this.getWorkCalendar();
    const events = await this.calendar.events.list({
      calendarId: id,
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
    });

    return events.data.items.filter(e => e.summary === eventType.office);
  }

  async getGroupedEventsByDay(start, end) {
    const events = await this.getOfficeEvents(start, end);

    return this.groupEvents(events);
  }

  groupEvents(events) {
    const daysOfWeek = new Array(5);

    for (let event of events) {
      const weekday = Date.getWeekday(Calendar.getEventStart(event));

      if (daysOfWeek[weekday - 1] === undefined) {
        daysOfWeek[weekday - 1] = [];
      }

      daysOfWeek[weekday - 1].push({
        start: Date.getTime(Calendar.getEventStart(event)),
        end: Date.getTime(Calendar.getEventEnd(event)),
      });
    }

    return daysOfWeek;
  }
};
