import { config } from './config';

const { TELEGRAM_API } = config;

if (!TELEGRAM_API) {
  throw new Error('TELEGRAM_API is not set');
}

import { scheduler } from './scheduler';
import { initBot } from './bot';
import { logger } from './utils';
import { infoLogger } from './utils/logger';

const init = async () => {
  const botController = await initBot(TELEGRAM_API);

  if (config.LOG_URL) {
    logger.setUrl(config.LOG_URL);
    infoLogger('Logger url set');
  }

  scheduler(botController);
};

init();
