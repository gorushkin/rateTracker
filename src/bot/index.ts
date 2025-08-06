import TelegramBot from 'node-telegram-bot-api';
import { addRoutes } from '../routes';
import { log, monitorBotHealth } from '../utils';

export const initBot = async (api: string) => {
  try {
    const bot = new TelegramBot(api, { polling: true });

    // Глобальная обработка ошибок polling
    bot.on('polling_error', (error) => {
      log.error(`Polling error: ${error.message}`);
      // Не прерываем работу бота при ошибках polling
    });

    // Глобальная обработка ошибок webhook (если используется)
    bot.on('webhook_error', (error) => {
      log.error(`Webhook error: ${error.message}`);
    });

    // Обработка всех остальных ошибок
    bot.on('error', (error) => {
      log.error(`Bot error: ${error.message}`);
    });

    const botController = addRoutes(bot);

    // Запуск мониторинга здоровья бота
    monitorBotHealth(bot);

    log.info('Bot started');

    return botController;
  } catch (error) {
    log.error(
      `Failed to initialize bot: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
};
