import TelegramBot, { ReplyKeyboardMarkup } from 'node-telegram-bot-api';
import { keyboards } from '../keyboards';
import { User } from '../services/user';
import { logger } from '../utils';
import { getRates } from '../api';
import { UserService, userService } from '../services/users';

class BotController {
  userService: UserService = userService;
  bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  private reply = async (
    user: User,
    message: string,
    keyboard: TelegramBot.ReplyKeyboardMarkup,
  ) => {
    this.bot.sendMessage(Number(user.id), message, {
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

    const keyboard = user.isAdmin
      ? keyboards.defaultAdminReplyKeyboard
      : keyboards.defaultUserReplyKeyboard;

    this.reply(user, message, keyboard);
  };

  onSettings = async (user: User) => {
    logger.addLog('Settings', user);

    const message = 'There are some settings for you:';

    this.reply(user, message, keyboards.settingsReplyKeyboard(user));
  };

  onHourlyUpdatesSettings = async (user: User) => {
    logger.addLog('HourlyUpdatesSettings', user);

    const { isHourlyUpdateEnabled } = await user.toggleHourlyUpdates();

    const status = isHourlyUpdateEnabled ? 'enabled' : 'disabled';

    const message = `Hourly updates are ${status}`;

    this.reply(user, message, keyboards.settingsReplyKeyboard(user));
  };

  onDailyUpdatesSettings = async (user: User) => {
    logger.addLog('DailyUpdatesSettings', user);

    const { isDailyUpdateEnabled } = await user.toggleDailyUpdate();

    const status = isDailyUpdateEnabled ? 'enabled' : 'disabled';

    const message = `Daily updates are ${status}`;

    this.reply(user, message, keyboards.settingsReplyKeyboard(user));
  };

  onSettingsInfo = async (user: User) => {
    const id = user.id;
    const username = user.username;
    const isHourlyUpdateEnabled = user.isHourlyUpdateEnabled;
    const isDailyUpdateEnabled = user.isDailyUpdateEnabled;

    const message =
      'User settings:\n\n' +
      `Username: ${username}\nID: ${id}\nHourly updates: ${isHourlyUpdateEnabled}\nDaily updates: ${isDailyUpdateEnabled}`;

    this.reply(user, message, keyboards.settingsReplyKeyboard(user));
  };

  onSystemInfo = async (user: User) => {
    logger.addLog('System info', user);

    const users = await this.userService.getUsers();

    const usersInfo = users
      .map(
        ({ id, username, role }) => `${id}: ${role} ${username ?? 'no name'}`,
      )
      .join('\n');

    const message = `Current users:\n\n${usersInfo}`;

    this.reply(user, message, keyboards.adminReplyKeyboard);
  };

  onViewLogs = (user: User) => {
    logger.addLog('View logs', user);

    const logs = logger.getLogs();

    const logsString = logs
      .map(({ time, message, id }) => `${id}: ${time} - ${message}`)
      .join('\n');

    const message = `Logs:\n\n${logsString}`;

    this.reply(user, message, keyboards.adminReplyKeyboard);
  };

  defaultResponse = (user: User) => {
    logger.addLog('Default response', user);

    const keyboard = user.isAdmin
      ? keyboards.defaultAdminReplyKeyboard
      : keyboards.defaultUserReplyKeyboard;

    const message = "I didn't got you!!!";

    this.reply(user, message, keyboard);
  };
}

export { BotController };
