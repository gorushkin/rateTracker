import { config } from './config';

const { TELEGRAM_API } = config;

if (!TELEGRAM_API) {
  throw new Error('TELEGRAM_API is not set');
}

import { scheduler } from './scheduler';
import { initBot } from './bot';
import { logger } from './utils';
import { log } from './utils';

const init = async () => {
  await initBot(TELEGRAM_API);

  if (config.LOG_URL) {
    logger.setUrl(config.LOG_URL);
    log.info('Logger url set');
  }

  // scheduler(botController);
};

init();
