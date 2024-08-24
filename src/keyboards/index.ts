import {
  type KeyboardButton,
  type ReplyKeyboardMarkup,
  type BotCommand,
} from 'node-telegram-bot-api';
import { User } from '../entity/database';

export enum Button {
  GET_RATES = 'Get rates',
  SETTINGS = 'Settings',
  SYSTEM_INFO = 'System info',
  VIEW_LOGS = 'View logs',
  MAIN_SCREEN = 'Main screen',
  REMINDER = 'REMINDER',
  TURN_ON_HOURLY_UPDATES = 'Turn on hourly updates',
  TURN_ON_DAILY_UPDATES = 'Turn on daily updates',
  TURN_OFF_DAILY_UPDATES = 'Turn on daily updates',
  TURN_OFF_HOURLY_UPDATES = 'Turn off hourly updates',
}

export enum Command {
  GET_RATES = 'get_rates',
  SETTINGS = 'settings',
}

export const commands: BotCommand[] = [
  { command: Command.GET_RATES, description: 'Get rates' },
  { command: Command.SETTINGS, description: 'Get rates' },
];

const getReplyButton = (buttontext: Button): KeyboardButton => ({
  text: buttontext,
});

const getRatesButton = getReplyButton(Button.GET_RATES);
const getSettingsButton = getReplyButton(Button.SETTINGS);
const getSystemInfoButton = getReplyButton(Button.SYSTEM_INFO);
const getLogsButton = getReplyButton(Button.VIEW_LOGS);
const mainScreenButton = getReplyButton(Button.MAIN_SCREEN);
const turnOnHourlyUpdateButton = getReplyButton(Button.TURN_ON_HOURLY_UPDATES);
const turnOffHourlyUpdateButton = getReplyButton(
  Button.TURN_OFF_HOURLY_UPDATES,
);

const turnOnDailyUpdateButton = getReplyButton(Button.TURN_ON_DAILY_UPDATES);
const turnOffDailyUpdateButton = getReplyButton(Button.TURN_OFF_DAILY_UPDATES);

const getReplyKeyboard = (buttons: KeyboardButton[][]): ReplyKeyboardMarkup => {
  return {
    keyboard: buttons,
    resize_keyboard: true,
    one_time_keyboard: false,
  };
};

const userButtons = [[getRatesButton, getSettingsButton]];

const adminButtons = [
  [getRatesButton, getSettingsButton],
  [getSystemInfoButton],
];

const adminInfoButtons = [
  [getSystemInfoButton, getLogsButton],
  [mainScreenButton],
];

const defaultUserReplyKeyboard = getReplyKeyboard(userButtons);

const defaultAdminReplyKeyboard = getReplyKeyboard(adminButtons);

const adminReplyKeyboard = getReplyKeyboard(adminInfoButtons);

const settingsReplyKeyboard = (user: User) => {
  const hourlyUpdateButton = user.isHourlyUpdateEnabled
    ? turnOffHourlyUpdateButton
    : turnOnHourlyUpdateButton;

  return getReplyKeyboard([[...[hourlyUpdateButton]], [mainScreenButton]]);
};

export const keyboards = {
  adminReplyKeyboard,
  defaultAdminReplyKeyboard,
  defaultUserReplyKeyboard,
  settingsReplyKeyboard,
};
