import moment from 'moment-timezone';

export function convertToTimezone(date, timezone) {
  return moment.utc(date).tz(timezone).format();
}

export function convertToUTC(date, timezone) {
  return moment.tz(date, timezone).utc().format();
}
