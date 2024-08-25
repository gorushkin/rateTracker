import {  addRoutes } from './routes';
import { config } from './config';
import cron from 'node-cron';

const { TELEGRAM_API } = config;

if (!TELEGRAM_API) {
  throw new Error('TELEGRAM_API is not set');
}

import TelegramBot from 'node-telegram-bot-api';
import { db } from './entity/database';

const init = async () => {
  try {
    const bot = new TelegramBot(TELEGRAM_API, { polling: true });

    addRoutes(bot);

  } catch (error) {
    console.error(error);
  }
};

cron.schedule('0 1-23 * * *', () => {
  const users = db.getUsers();

  users.forEach((user) => {
    if (user.isHourlyUpdateEnabled) {
      user.sendRates();
    }
  });
});

init();
