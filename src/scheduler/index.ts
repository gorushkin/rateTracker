import cron from 'node-cron';
import dayjs from 'dayjs';
import { userService } from '../entity/user';
import TelegramBot from 'node-telegram-bot-api';
import { BotController } from '../controllers';

enum INTERVALS {
  HOUR = '0 * * * *',
  DAY = '0 9 * * *',
  MINUTE = '* * * * *',
}

export const scheduler = async (botController?: BotController) => {
  if (!botController) {
    throw new Error('Bot is not initialized');
  }

  cron.schedule(INTERVALS.HOUR, async () => {
    const users = await userService.getUsers();

    const currentTime = dayjs();

    const promises = users.map((user) => {
      const shouldUserBeUpdated = user.shouldUserBeUpdated(currentTime);

      if (shouldUserBeUpdated) {
        botController.onGetRates(user);
      }
    });

    try {
      Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  });
};
