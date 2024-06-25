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

    user.sendMessage(message, keyboard);
  };

  onSettings = async (user: User) => {
    logger.addLog('Settings', user);

    const message = 'There are some settings for you:';

    user.sendMessage(message, keyboards.settingsReplyKeyboard(user));
  };

  onHourlyUpdatesSettings = async (user: User) => {
    logger.addLog('Settings', user);

    const isHourlyUpdateEnabled = user.toggleOnHourlyUpdate();

    const message = isHourlyUpdateEnabled
      ? 'Hourly updates are enabled'
      : 'Hourly updates are disabled';

    user.sendMessage(message, keyboards.settingsReplyKeyboard(user));
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

    user.sendMessage(message, keyboards.adminReplyKeyboard);
  };

  onViewLogs = (user: User) => {
    logger.addLog('View logs', user);

    const logs = logger.getLogs();

    const logsString = logs
      .map(({ time, message, id }) => `${id}: ${time} - ${message}`)
      .join('\n');

    const message = `Logs:\n\n${logsString}`;

    user.sendMessage(message, keyboards.adminReplyKeyboard);
  };

  defaultResponse = (user: User) => {
    logger.addLog('Default response', user);

    const keyboard = user.isAdmin()
      ? keyboards.defaultAdminReplyKeyboard
      : keyboards.defaultUserReplyKeyboard;

    user.sendMessage("I didn't got you!!!", keyboard);
  };
}

export { BotController };
