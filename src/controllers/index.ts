import TelegramBot, { ReplyKeyboardMarkup } from 'node-telegram-bot-api';
import { keyboards } from '../keyboards';
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

    const keyboard = user.isAdmin()
      ? keyboards.defaultAdminReplyKeyboard
      : keyboards.defaultUserReplyKeyboard;

    this.sendMessage(user, message, keyboard);
  };

  onSettings = async (user: User) => {
    logger.addLog('Settings', user);

    const message = 'There are some settings for you:';

    this.sendMessage(user, message, keyboards.settingsReplyKeyboard(user));
  };

  onHourlyUpdatesSettings = async (user: User) => {
    logger.addLog('Settings', user);

    const isHourlyUpdateEnabled = user.toggleOnHourlyUpdate();

    const message = isHourlyUpdateEnabled
      ? 'Hourly updates are enabled'
      : 'Hourly updates are disabled';

    this.sendMessage(user, message, keyboards.settingsReplyKeyboard(user));
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

    this.sendMessage(user, message, keyboards.adminReplyKeyboard);
  };

  onViewLogs = (user: User) => {
    logger.addLog('View logs', user);

    const logs = logger.getLogs();

    const logsString = logs
      .map(({ time, message, id }) => `${id}: ${time} - ${message}`)
      .join('\n');

    const message = `Logs:\n\n${logsString}`;

    this.sendMessage(user, message, keyboards.adminReplyKeyboard);
  };

  defaultResponse = (user: User) => {
    logger.addLog('Default response', user);

    const keyboard = user.isAdmin()
      ? keyboards.defaultAdminReplyKeyboard
      : keyboards.defaultUserReplyKeyboard;

    this.sendMessage(user, "I didn't got you!!!", keyboard);
  };
}

export { BotController };
