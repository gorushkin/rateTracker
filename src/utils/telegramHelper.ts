import TelegramBot from 'node-telegram-bot-api';
import { log } from './logger';

export interface TelegramError extends Error {
  response?: {
    body?: {
      error_code?: number;
      description?: string;
    };
  };
}

export const isTelegramError = (error: unknown): error is TelegramError => {
  return error instanceof Error && 'response' in error;
};

export const getTelegramErrorCode = (error: TelegramError): number | null => {
  return error.response?.body?.error_code || null;
};

export const getTelegramErrorDescription = (
  error: TelegramError,
): string | null => {
  return error.response?.body?.description || null;
};

/**
 * Безопасная отправка сообщения через Telegram API
 */
export const safeSendMessage = async (
  bot: TelegramBot,
  chatId: number | string,
  text: string,
  options?: TelegramBot.SendMessageOptions,
): Promise<TelegramBot.Message | null> => {
  try {
    return await bot.sendMessage(chatId, text, options);
  } catch (error) {
    if (isTelegramError(error)) {
      const errorCode = getTelegramErrorCode(error);
      const description = getTelegramErrorDescription(error);

      switch (errorCode) {
        case 403:
          if (description?.includes('bot was blocked by the user')) {
            log.error(`Bot was blocked by user ${chatId}`);
            // Здесь можно добавить логику для пометки пользователя как заблокированного
            return null;
          }
          if (description?.includes('chat not found')) {
            log.error(`Chat ${chatId} not found`);
            return null;
          }
          break;

        case 400:
          if (description?.includes('chat not found')) {
            log.error(`Chat ${chatId} not found`);
            return null;
          }
          if (description?.includes('message is too long')) {
            log.error(`Message too long for chat ${chatId}`);
            return null;
          }
          break;

        case 429:
          log.error(`Rate limit exceeded for chat ${chatId}`);
          // Можно добавить логику повторной отправки с задержкой
          return null;

        default:
          log.error(
            `Telegram API error ${errorCode}: ${description} for chat ${chatId}`,
          );
          return null;
      }
    } else {
      log.error(
        `Unknown error sending message to chat ${chatId}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return null;
  }
};

/**
 * Безопасная отправка фото через Telegram API
 */
export const safeSendPhoto = async (
  bot: TelegramBot,
  chatId: number | string,
  photo: string | Buffer,
  options?: TelegramBot.SendPhotoOptions,
): Promise<TelegramBot.Message | null> => {
  try {
    return await bot.sendPhoto(chatId, photo, options);
  } catch (error) {
    if (isTelegramError(error)) {
      const errorCode = getTelegramErrorCode(error);
      const description = getTelegramErrorDescription(error);

      switch (errorCode) {
        case 403:
          if (description?.includes('bot was blocked by the user')) {
            log.error(`Bot was blocked by user ${chatId}`);
            return null;
          }
          break;

        case 400:
          if (description?.includes('photo should be uploaded as InputFile')) {
            log.error(`Invalid photo format for chat ${chatId}`);
            return null;
          }
          break;

        case 429:
          log.error(`Rate limit exceeded for chat ${chatId}`);
          return null;

        default:
          log.error(
            `Telegram API error ${errorCode}: ${description} for chat ${chatId}`,
          );
          return null;
      }
    } else {
      log.error(
        `Unknown error sending photo to chat ${chatId}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return null;
  }
};

/**
 * Безопасное редактирование сообщения через Telegram API
 */
export const safeEditMessage = async (
  bot: TelegramBot,
  text: string,
  options: TelegramBot.EditMessageTextOptions,
): Promise<TelegramBot.Message | boolean | null> => {
  try {
    return await bot.editMessageText(text, options);
  } catch (error) {
    if (isTelegramError(error)) {
      const errorCode = getTelegramErrorCode(error);
      const description = getTelegramErrorDescription(error);

      switch (errorCode) {
        case 400:
          if (description?.includes('message is not modified')) {
            log.error('Attempted to edit message with same content');
            return null;
          }
          if (description?.includes('message to edit not found')) {
            log.error('Message to edit not found');
            return null;
          }
          break;

        case 403:
          log.error('No access to edit this message');
          return null;

        default:
          log.error(`Telegram API error ${errorCode}: ${description}`);
          return null;
      }
    } else {
      log.error(
        `Unknown error editing message: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return null;
  }
};
