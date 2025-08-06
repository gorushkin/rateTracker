import TelegramBot from 'node-telegram-bot-api';
import { BotController } from '../controllers';
import { commands } from '../keyboards';
import { getActionController, getRouteController } from './libs/routesHelper';
import { userService } from '../services/users';
import { log } from '../utils';

export const addRoutes = async (bot: TelegramBot) => {
  const botController = new BotController(bot);

  void bot.setMyCommands(commands);

  bot.on('message', async (msg: TelegramBot.Message) => {
    const {
      chat: { id, username },
    } = msg;

    try {
      const user = await userService.addUser(id, username);

      log.message(`Received message: ${msg.text}`);

      const context = user.getContext();

      if (context) {
        const actionController = getActionController(botController)(context);
        return actionController(user, msg.text);
      }

      const controller = getRouteController(botController)(msg.text);

      return controller(user, msg.text);
    } catch (error) {
      if (error instanceof Error) {
        // Специфические ошибки Telegram API
        if (
          error.message.includes(
            'ETELEGRAM: 403 Forbidden: bot was blocked by the user',
          )
        ) {
          log.error(`User ${id} blocked the bot`);
          // Здесь можно добавить логику для пометки пользователя как заблокированного
          return;
        }

        if (
          error.message.includes('ETELEGRAM: 400 Bad Request: chat not found')
        ) {
          log.error(`Chat ${id} not found`);
          return;
        }

        if (error.message.includes('ETELEGRAM: 429 Too Many Requests')) {
          log.error(`Rate limit exceeded for chat ${id}`);
          return;
        }

        log.error(`Message handler error for chat ${id}: ${error.message}`);
      } else {
        log.error(
          `Unknown error in message handler for chat ${id}: ${String(error)}`,
        );
      }
    }
  });

  return botController;
};
