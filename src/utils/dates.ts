import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const CURRENT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const utcDayjs = () => dayjs().utc();

export const getCurrentDateTime = (): string =>
  utcDayjs().format(CURRENT_DATE_FORMAT);
