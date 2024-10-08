import TelegramBot from 'node-telegram-bot-api';
import { addRoutes } from '../routes';
import { log } from '../utils';

export const initBot = async (api: string) => {
  try {
    const bot = new TelegramBot(api, { polling: true });
    const botController = addRoutes(bot);
    log.info('Bot started');

    return botController;
  } catch (error) {
    console.log('error: ', error);
  }
};
