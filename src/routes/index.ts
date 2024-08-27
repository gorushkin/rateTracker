import TelegramBot from 'node-telegram-bot-api';
import { BotController } from '../controllers';
import { commands } from '../keyboards';
import { logger } from '../utils';
import { checkRoute } from './libs';
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

      if (checkRoute.isRouteGetRates(msg.text)) {
        return botController.onGetRates(user);
      }

      if (checkRoute.isRouteMainScreen(msg.text)) {
        return botController.onGetRates(user);
      }

      if (checkRoute.isRouteSettings(msg.text)) {
        return botController.onSettings(user);
      }

      if (checkRoute.isRouteHourlyUpdatesSettings(msg.text)) {
        return botController.onHourlyUpdatesSettings(user);
      }

      if (checkRoute.isRouteDailyUpdatesSettings(msg.text)) {
        return botController.onDailyUpdatesSettings(user);
      }

      if (checkRoute.isRouteSettingsInfo(msg.text)) {
        return botController.onSettingsInfo(user);
      }

      if (checkRoute.isRouteSystemInfo(msg.text)) {
        if (!user.isAdmin) {
          throw new Error('User is not an admin');
        }
        return botController.onSystemInfo(user);
      }

      if (checkRoute.isRouteViewLogs(msg.text)) {
        if (!user.isAdmin) {
          throw new Error('User is not an admin');
        }
        return botController.onViewLogs(user);
      }

      botController.defaultResponse(user);
    } catch (error) {
      console.log('error: ', error);
    }
  });

  return botController;
};
