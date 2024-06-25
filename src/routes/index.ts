import TelegramBot from 'node-telegram-bot-api';
import { BotController } from '../controllers';
import { commands } from '../keyboards';
import { db } from '../entity/database';
import { logger } from '../entity/log';
import { checkRoute } from './libs';

export const addRoutes = async (bot: TelegramBot) => {
  const botController = new BotController(bot, db);

  void bot.setMyCommands(commands);

  bot.on('message', (msg: TelegramBot.Message) => {
    const {
      chat: { id, username },
    } = msg;

    const user = db.addUser(id, username);

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

    if (checkRoute.isRouteSystemInfo(msg.text)) {
      if (!user.isAdmin()) {
        throw new Error('User is not an admin');
      }
      return botController.onSystemInfo(user);
    }

    if (checkRoute.isRouteViewLogs(msg.text)) {
      if (!user.isAdmin()) {
        throw new Error('User is not an admin');
      }
      return botController.onViewLogs(user);
    }

    botController.defaultResponse(user);
  });
};
