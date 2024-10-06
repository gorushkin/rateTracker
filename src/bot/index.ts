import TelegramBot from 'node-telegram-bot-api';
import { addRoutes } from '../routes';
import { infoLogger } from '../utils/logger';

export const initBot = async (api: string) => {
  try {
    const bot = new TelegramBot(api, { polling: true });
    const botController = addRoutes(bot);
    infoLogger('Bot started');

    return botController;
  } catch (error) {
    console.log('error: ', error);
  }
};
