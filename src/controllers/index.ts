import TelegramBot, { ReplyKeyboardMarkup } from 'node-telegram-bot-api';
import { getAdminReplyKeyboard, getDefaultReplyKeyboard } from '../keyboards';
import { getRates } from '../api';
import { DB, User } from '../entity/database';
import { logger } from '../entity/log';

class BotController {
  constructor(
    public bot: TelegramBot,
    public db: DB,
  ) {}

  sendMessage = (
    user: User,
    message: string,
    keyboard: ReplyKeyboardMarkup,
  ) => {
    this.bot.sendMessage(user.id, message, {
      reply_markup: {
        ...keyboard,
      },
    });
  };

  onGetRates = async (user: User) => {
    logger.addLog('Getting rates', user);

    const rates = await getRates();

    const date = new Date().toUTCString();

    const ratesString = rates
      .map(({ currency, rate }) => `${currency}: ${rate}`)
      .join('\n');

    const message = `Rates at ${date}:\n\n${ratesString}`;

    this.sendMessage(user, message, getDefaultReplyKeyboard(user));
  };

  onSettings = async (user: User) => {
    logger.addLog('Settings', user);

    const message = "It doesn't work yet";

    this.sendMessage(user, message, getDefaultReplyKeyboard(user));
  };

  onSystemInfo = (user: User) => {
    logger.addLog('System info', user);

    const users = this.db
      .showInfo()
      .map(
        ({ id, username, role }) => `${id}: ${role} ${username ?? 'no name'}`,
      )
      .join('\n');

    const message = `Current users:\n\n${users}`;

    this.sendMessage(user, message, getAdminReplyKeyboard());
  };

  onViewLogs = (user: User) => {
    logger.addLog('View logs', user);

    const logs = logger.getLogs();

    const logsString = logs
      .map(({ time, message, id }) => `${id}: ${time} - ${message}`)
      .join('\n');

    const message = `Logs:\n\n${logsString}`;

    this.sendMessage(user, message, getAdminReplyKeyboard());
  };

  defaultResponse = (user: User) => {
    logger.addLog('Default response', user);

    this.sendMessage(
      user,
      "let's do something!",
      getDefaultReplyKeyboard(user),
    );
  };
}

export { BotController };
