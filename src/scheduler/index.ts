import cron from 'node-cron';
import { db } from '../entity/database';
import dayjs from 'dayjs';

enum INTERVALS {
  HOUR = '0 * * * *',
  DAY = '0 9 * * *',
  MINUTE = '* * * * *',
}

export const scheduler = () => {
  cron.schedule(INTERVALS.HOUR, () => {
    const users = db.getUsers();

    const currentTime = dayjs();

    const promises = users.map(({ updateUserRates }) =>
      updateUserRates(currentTime),
    );

    try {
      Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  });
};
