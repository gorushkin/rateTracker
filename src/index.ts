import { addRoutes } from './routes';
import { config } from './config';

const { TELEGRAM_API } = config;

if (!TELEGRAM_API) {
  throw new Error('TELEGRAM_API is not set');
}

import TelegramBot from 'node-telegram-bot-api';
import { scheduler } from './scheduler';

const init = async () => {
  try {
    const bot = new TelegramBot(TELEGRAM_API, { polling: true });

    addRoutes(bot);
  } catch (error) {
    console.error(error);
  }

  scheduler();
};

init();
