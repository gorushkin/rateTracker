import TelegramBot from 'node-telegram-bot-api';
import { BotController } from '../controllers';
import {
  Button,
  Command,
  commands,
  isGetRates,
} from '../keyboards';
import { db } from '../entity/database';
import { logger } from '../entity/log';

export const addRoutes = async (bot: TelegramBot) => {
  const botController = new BotController(bot, db);

  void bot.setMyCommands(commands);

  bot.on('message', (msg: TelegramBot.Message) => {
    const {
      chat: { id, username },
    } = msg;

    const user = db.addUser(id, username);

    logger.addLog(`Received message: ${msg.text}`, user);

    if (msg.text === Button.GET_RATES || isGetRates(msg.text)) {
      return botController.onGetRates(user);
    }

    if (msg.text === Button.SETTINGS || isGetRates(msg.text)) {
      return botController.onSettings(user);
    }

    if (msg.text === Button.SYSTEM_INFO) {
      if (!user.isAdmin()) {
        throw new Error('User is not an admin');
      }
      return botController.onSystemInfo(user);
    }

    if (msg.text === Button.VIEW_LOGS) {
      if (!user.isAdmin()) {
        throw new Error('User is not an admin');
      }
      return botController.onViewLogs(user);
    }

    botController.defaultResponse(user);
  });
};
