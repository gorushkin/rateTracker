import TelegramBot, {
  ForceReply,
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
} from 'node-telegram-bot-api';
import { replyKeyboards } from '../keyboards';
import { User } from '../services/user';
import { logger } from '../utils';
import { getRates } from '../api';
import { UserService, userService } from '../services/users';
import { ratesService } from '../services/rates';
import {
  getUserTime,
  minutesToTimezone,
  offsetToMinutes,
  validateTimeZone,
} from '../routes/libs';
import { ApiError, ValidationError } from '../errors';

type ReplyProps = {
  user: User;
  message: string;
  replyMarkup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply
    | undefined;
};

class BotController {
  userService: UserService = userService;
  bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  private reply = async (props: ReplyProps) => {
    const { user, message, replyMarkup } = props;

    this.bot.sendMessage(Number(user.id), message, {
      ...(replyMarkup && {
        reply_markup: {
          ...replyMarkup,
        },
      }),
    });
  };

  onGetRates = async (user: User) => {
    logger.addLog('Getting rates', user);

    const response = await getRates();
    console.log('response: ', response);

    if (!response.ok) {
      throw new ApiError('There is no connection to the server');
    }

    const date = new Date();

    const rates = await ratesService.fetchRates();

    const userDate = getUserTime(user.utcOffset, date);

    const ratesString = rates
      .map(({ currency, rate }) => `${currency}: ${rate}`)
      .join('\n');

    const message = `Rates at ${userDate}:\n\n${ratesString}`;

    const replyMarkup = user.isAdmin
      ? replyKeyboards.defaultAdminReplyKeyboard
      : replyKeyboards.defaultUserReplyKeyboard;

    this.reply({ user, message, replyMarkup });
  };

  onSettings = async (user: User) => {
    logger.addLog('Settings', user);

    const message = 'There are some settings for you:';

    console.log(
      JSON.stringify(replyKeyboards.settingsReplyKeyboard(user), null, 2),
    );

    this.reply({
      user,
      message,
      replyMarkup: replyKeyboards.settingsReplyKeyboard(user),
    });
  };

  onHourlyUpdatesSettings = async (user: User) => {
    logger.addLog('HourlyUpdatesSettings', user);

    const { isHourlyUpdateEnabled } = await user.toggleHourlyUpdates();

    const status = isHourlyUpdateEnabled ? 'enabled' : 'disabled';

    const message = `Hourly updates are ${status}`;

    this.reply({
      user,
      message,
      replyMarkup: replyKeyboards.settingsReplyKeyboard(user),
    });
  };

  onDailyUpdatesSettings = async (user: User) => {
    logger.addLog('DailyUpdatesSettings', user);

    const { isDailyUpdateEnabled } = await user.toggleDailyUpdate();

    const status = isDailyUpdateEnabled ? 'enabled' : 'disabled';

    const message = `Daily updates are ${status}`;

    this.reply({
      user,
      message,
      replyMarkup: replyKeyboards.settingsReplyKeyboard(user),
    });
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

    this.reply({
      user,
      message,
      replyMarkup: replyKeyboards.settingsReplyKeyboard(user),
    });
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

    this.reply({
      user,
      message,
      replyMarkup: replyKeyboards.adminReplyKeyboard,
    });
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

    this.reply({
      user,
      message,
      replyMarkup: replyKeyboards.adminReplyKeyboard,
    });
  };

  showSettingUtcOffset = async (user: User) => {
    user.context.setUserUtcOffset(user.id);

    this.reply({
      user,
      message: 'Enter your utc offset',
      replyMarkup: {
        remove_keyboard: true,
      },
    });
  };

  private validateUtcOffsetValue = (message: string, user: User) => {
    const isTimeZoneValid = validateTimeZone(message ?? '');

    if (isTimeZoneValid) return;

    this.reply({
      user,
      message: 'Invalid utc offset',
      replyMarkup: replyKeyboards.settingsReplyKeyboard(user),
    });

    // TODO: it should be refactored

    throw new ValidationError('Invalid utc offset');
  };

  setUtcOffset = async (user: User, message?: string) => {
    this.validateUtcOffsetValue(message ?? '', user);

    const offset = offsetToMinutes(message);

    await user.setUtcOffset(offset);

    const timeZone = minutesToTimezone(offset);

    this.reply({
      user,
      message: 'Your utc offset has been set to ' + timeZone,
      replyMarkup: replyKeyboards.settingsReplyKeyboard(user),
    });
  };

  defaultResponse = async (user: User) => {
    logger.addLog('Default response', user);

    const replyMarkup = user.isAdmin
      ? replyKeyboards.defaultAdminReplyKeyboard
      : replyKeyboards.defaultUserReplyKeyboard;

    const message = "I didn't get you!!!";

    this.reply({ user, message, replyMarkup });
  };
}

export { BotController };
