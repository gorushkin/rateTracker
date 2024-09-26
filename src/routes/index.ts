import TelegramBot from 'node-telegram-bot-api';
import { BotController } from '../controllers';
import { commands } from '../keyboards';
import { logger } from '../utils';
import { getActionController, getRouteController } from './libs/routesHelper';
import { userService } from '../services/users';

export const addRoutes = async (bot: TelegramBot) => {
  const botController = new BotController(bot);

  void bot.setMyCommands(commands);

  bot.on('message', async (msg: TelegramBot.Message) => {
    const {
      chat: { id, username },
    } = msg;

    try {
      const user = await userService.addUser(id, username);

      logger.addLog(`Received message: ${msg.text}`, user);

      const context = user.getContext();

      if (context) {
        const actionController = getActionController(botController)(context);
        return actionController(user, msg.text);
      }

      const controller = getRouteController(botController)(msg.text);

      return controller(user, msg.text);
    } catch (error) {
      console.log('error: ', error);
    }
  });

  return botController;
};
