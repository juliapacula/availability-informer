const config = require('config');
const moment = require('moment');

module.exports = class Date {
    constructor(date) {
        this.day = moment(date, 'DD-MM-YYYY');
    }

    static get today() {
        return moment().toDate();
    }

    get monthName() {
        return moment(this.day).format('MMMM YYYY');
    }

    get startOfMonth() {
        return moment(this.day).date(1).startOf('day');
    }

    get endOfMonth() {
        return moment(this.day).date(31).endOf('day');
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

    static countHoursBetweenDates(start, end) {
        const getHour = (event) => parseInt(event.split(':')[0], 10);
        const getMinutes = (event) => parseInt(event.split(':')[1], 10);
        const momentStart = moment().set({ hours: getHour(start), minutes: getMinutes(start) });
        const momentEnd = moment().set({ hours: getHour(end), minutes: getMinutes(end) });
        const duration = moment.duration(momentEnd.diff(momentStart));

        return duration.asHours();
    }

    static parseDayEvents(events) {
        if (!events) {
            return '';
        }

        let final = '';
        const getHour = (event) => parseInt(event.start.split(':')[0], 10);
        events.sort((event1, event2) => getHour(event1) - getHour(event2));

        for (let event = 0; event < events.length; event++) {
            const isRemoteEvent = events[event].type === config.get('eventType.remote');
            const isOfficeEvent = events[event].type === config.get('eventType.office');

            final += isRemoteEvent ? '🏠 ' : (isOfficeEvent ? '🏢 ' : '');
            final += `${events[event].start}-${events[event].end}`;

            if (event !== events.length - 1) {
                final += '; ';
            }
        }

        return final;
    }
};
