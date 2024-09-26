import TelegramBot, { ReplyKeyboardMarkup } from 'node-telegram-bot-api';
import { keyboards } from '../keyboards';
import { User } from '../services/user';
import { logger } from '../utils';
import { getRates } from '../api';
import { UserService, userService } from '../services/users';
import { ratesService } from '../services/rates';
import {
  getUserTime,
  minutesToTimezone,
  timezoneToMinutes,
  validateTimeZone,
} from '../routes/libs';
import { AppError } from '../errors';

class BotController {
  userService: UserService = userService;
  bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  private reply = async (
    user: User,
    message: string,
    replyKeyboard?: TelegramBot.ReplyKeyboardMarkup,
    inlineKeyboard?: TelegramBot.InlineKeyboardMarkup,
  ) => {
    this.bot.sendMessage(Number(user.id), message, {
      ...(replyKeyboard && { reply_markup: replyKeyboard }),
      ...(inlineKeyboard && { reply_markup: inlineKeyboard }),
    });
  };

  onGetRates = async (user: User) => {
    logger.addLog('Getting rates', user);

    const response = await getRates();

    if (!response.ok) {
      throw new AppError.ApiError('There is no connection to the server');
    }

    const date = new Date();

    const rates = await ratesService.fetchRates();

    const userDate = getUserTime(user.utcOffset, date);

    const ratesString = rates
      .map(({ currency, rate }) => `${currency}: ${rate}`)
      .join('\n');

    const message = `Rates at ${userDate}:\n\n${ratesString}`;

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
    const timeZone = minutesToTimezone(user.utcOffset);

    const message =
      'User settings:\n\n' +
      `Username: ${username}\nID: ${id}\nHourly updates: ${isHourlyUpdateEnabled}\nDaily updates: ${isDailyUpdateEnabled}\nTimezone: ${timeZone}`;

    this.reply(user, message, keyboards.settingsReplyKeyboard(user));
  };

  onSystemInfo = async (user: User) => {
    if (!user.isAdmin) {
      throw new Error('User is not an admin');
    }

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

  onViewLogs = async (user: User) => {
    if (!user.isAdmin) {
      throw new Error('User is not an admin');
    }

    logger.addLog('View logs', user);

    const logs = logger.getLogs();

    const logsString = logs
      .map(({ time, message, id }) => `${id}: ${time} - ${message}`)
      .join('\n');

    const message = `Logs:\n\n${logsString}`;

    this.reply(user, message, keyboards.adminReplyKeyboard);
  };

  showSettingUtcOffset = async (user: User) => {
    user.context.setUserUtcOffset(user.id);

    this.reply(user, 'input utc offset');
  };

  private validateUtcOffsetValue = (message: string, user: User) => {
    const isTimeZoneValid = validateTimeZone(message ?? '');

    if (isTimeZoneValid) return;

    this.reply(
      user,
      'Invalid utc offset',
      keyboards.settingsReplyKeyboard(user),
    );

    // TODO: it should be refactored

    throw new AppError.Validation('Invalid utc offset');
  };

  setUtcOffset = async (user: User, message?: string) => {
    this.validateUtcOffsetValue(message ?? '', user);

    const offset = timezoneToMinutes(message);

    await user.setUtcOffset(offset);

    const timeZone = minutesToTimezone(offset);

    this.reply(
      user,
      'Your utc offset has been set to ' + timeZone,
      keyboards.settingsReplyKeyboard(user),
    );
  };

  defaultResponse = async (user: User) => {
    logger.addLog('Default response', user);

    const keyboard = user.isAdmin
      ? keyboards.defaultAdminReplyKeyboard
      : keyboards.defaultUserReplyKeyboard;

    const message = "I didn't get you!!!";

    this.reply(user, message, keyboard);
  };
}

export { BotController };
