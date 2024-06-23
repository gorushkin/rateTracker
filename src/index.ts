import {  addRoutes } from './routes';
import { config } from './config';

const { TELEGRAM_API } = config;

import TelegramBot from 'node-telegram-bot-api';

const init = async () => {
  try {
    const bot = new TelegramBot(TELEGRAM_API, { polling: true });

    addRoutes(bot);

  } catch (error) {
    console.error(error);
  }
};

init();
