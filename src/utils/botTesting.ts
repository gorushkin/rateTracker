import TelegramBot from 'node-telegram-bot-api';
import { safeSendMessage, log } from '../utils';

/**
 * Пример функции для тестирования обработки ошибок Telegram API
 */
export const testErrorHandling = async (bot: TelegramBot) => {
  // Тест 1: Отправка сообщения несуществующему пользователю
  console.log('Testing non-existent user...');
  const result1 = await safeSendMessage(bot, 999999999, 'Test message');
  console.log('Result for non-existent user:', result1);

  // Тест 2: Отправка очень длинного сообщения
  console.log('Testing long message...');
  const longMessage = 'a'.repeat(5000); // Максимум 4096 символов в Telegram
  const result2 = await safeSendMessage(bot, 999999999, longMessage);
  console.log('Result for long message:', result2);

  // Тест 3: Отправка сообщения с невалидными символами
  console.log('Testing invalid characters...');
  const invalidMessage = 'Test with invalid markdown: `unclosed code';
  const result3 = await safeSendMessage(bot, 999999999, invalidMessage);
  console.log('Result for invalid markdown:', result3);
};

/**
 * Функция для мониторинга состояния бота
 */
export const monitorBotHealth = (bot: TelegramBot) => {
  let pollingErrors = 0;
  let lastPollingError: Date | null = null;

  bot.on('polling_error', (error) => {
    pollingErrors++;
    lastPollingError = new Date();

    log.error(`Polling error #${pollingErrors}: ${error.message}`);

    // Если слишком много ошибок подряд, возможно нужно перезапустить polling
    if (pollingErrors > 10) {
      log.error('Too many polling errors, consider restarting the bot');
    }
  });

  // Сброс счетчика ошибок при успешном получении сообщения
  bot.on('message', () => {
    if (pollingErrors > 0) {
      log.info(`Polling recovered after ${pollingErrors} errors`);
      pollingErrors = 0;
    }
  });

  // Периодическая проверка состояния
  setInterval(() => {
    if (lastPollingError && Date.now() - lastPollingError.getTime() > 300000) {
      // 5 минут
      log.info('Bot polling is healthy');
    }
  }, 60000); // Проверка каждую минуту
};

/**
 * Retry функция для критически важных сообщений
 */
export const sendWithRetry = async (
  bot: TelegramBot,
  chatId: number | string,
  message: string,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<TelegramBot.Message | null> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await safeSendMessage(bot, chatId, message);

    if (result) {
      return result;
    }

    if (attempt < maxRetries) {
      log.error(
        `Failed to send message to ${chatId}, attempt ${attempt}/${maxRetries}. Retrying in ${delay}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }

  log.error(`Failed to send message to ${chatId} after ${maxRetries} attempts`);
  return null;
};
