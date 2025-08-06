import { config } from './config';

const { TELEGRAM_API } = config;

if (!TELEGRAM_API) {
  throw new Error('TELEGRAM_API is not set');
}

import { scheduler } from './scheduler';
import { initBot } from './bot';
import { logger } from './utils';
import { log } from './utils';

// Глобальная обработка необработанных промисов
process.on('unhandledRejection', (reason, promise) => {
  log.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  // Не завершаем процесс, просто логируем
});

// Глобальная обработка необработанных исключений
process.on('uncaughtException', (error) => {
  log.error(`Uncaught Exception: ${error.message}`);
  log.error(`Stack: ${error.stack}`);
  // В случае критической ошибки лучше перезапустить процесс
  process.exit(1);
});

const init = async () => {
  try {
    const botController = await initBot(TELEGRAM_API);

    if (config.LOG_URL) {
      logger.setUrl(config.LOG_URL);
      log.info('Logger url set');
    }

    scheduler(botController);
  } catch (error) {
    log.error(
      `Failed to initialize application: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
};

init();
