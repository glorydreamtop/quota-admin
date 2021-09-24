/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD ';

type dayisInput = string | number | Date | dayjs.Dayjs | null | undefined;

export function formatToDateTime(date?: dayisInput, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToDate(date?: dayisInput, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

export function today() {
  return formatToDate();
}

export function yearsAgo(year: number, dateStr?: dayisInput) {
  return dayjs(dateStr).subtract(year, 'year').format(DATE_FORMAT);
}

export function monthsAgo(month: number, dateStr?: dayisInput) {
  return dayjs(dateStr).subtract(month, 'month').format(DATE_FORMAT);
}

export function daysAgo(day: number, dateStr?: dayisInput) {
  return dayjs(dateStr).subtract(day, 'day').format(DATE_FORMAT);
}

export const dateUtil = dayjs;
