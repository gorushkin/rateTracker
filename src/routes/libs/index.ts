import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const validateTimeZone = (timeZone: string) => {
  const timeZoneRegex = /^([+-]?)([01]\d|2[0-3]):([0-5]\d)$/;
  return timeZoneRegex.test(timeZone);
};

export const timezoneToMinutes = (timeStr?: string): number => {
  if (!timeStr) {
    return 0;
  }

  const sign = timeStr.startsWith('-') ? -1 : 1;
  const [hours, minutes] = timeStr.replace('-', '').split(':').map(Number);
  return sign * (hours * 60 + minutes);
};

export const minutesToTimezone = (minutes: number): string => {
  const sign = minutes < 0 ? '-' : '+';
  const absMinutes = Math.abs(minutes);
  const hours = Math.floor(absMinutes / 60);
  const remainingMinutes = absMinutes % 60;
  return `${sign}${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
};

export const getUserTime = (utcOffset: number, date: Date): string => {
  return dayjs(date).utcOffset(utcOffset).format('YYYY-MM-DD HH:mm:ss');
};
