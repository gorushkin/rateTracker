import cron from 'node-cron';
import dayjs from 'dayjs';
import TelegramBot from 'node-telegram-bot-api';
import { BotController } from '../controllers';
import { userService } from '../services/users';
import { log } from '../utils/';

enum INTERVALS {
  HOUR = '0 * * * *',
  DAY = '0 9 * * *',
  MINUTE = '* * * * *',
}

export const scheduler = async (botController?: BotController) => {
  if (!botController) {
    throw new Error('Bot is not initialized');
  }

  log.info('Scheduler started');

  cron.schedule(INTERVALS.HOUR, async () => {
    try {
      const users = await userService.getUsers();

      const currentTime = dayjs();

      const promises = users.map(async (user) => {
        try {
          const shouldUserBeUpdated = user.shouldUserBeUpdated(currentTime);

          if (shouldUserBeUpdated) {
            await botController.onGetRates(user);
          }
        } catch (error) {
          log.error(
            `Error processing user ${user.id} in scheduler: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      });

      await Promise.all(promises);
    } catch (error) {
      log.error(
        `Error in scheduled task: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });
};
