import { config } from './config';

const { TELEGRAM_API } = config;

if (!TELEGRAM_API) {
  throw new Error('TELEGRAM_API is not set');
}

import { scheduler } from './scheduler';
import { initBot } from './bot';
import { initDB } from './databaseConnection';

const init = async () => {
  const botController = await initBot(TELEGRAM_API);
  await initDB();

  scheduler(botController);
};

init();
