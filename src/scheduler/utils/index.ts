import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const paresTime = (time: string) => dayjs(time, 'HH:mm');

export const compareTime = (timeString: string, referenceTime: Dayjs) => {
  const timeToCheck = paresTime(timeString);

  const startTime = referenceTime.subtract(30, 'minute');
  const endTime = referenceTime.add(30, 'minute');

  const isWithinRange =
    timeToCheck.isAfter(startTime) && timeToCheck.isBefore(endTime);

  return isWithinRange;
};
