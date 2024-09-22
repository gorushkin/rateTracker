import { User as UserDTO } from '@prisma/client';

import {
  type KeyboardButton,
  type ReplyKeyboardMarkup,
  type BotCommand,
} from 'node-telegram-bot-api';

export enum Button {
  GET_RATES = 'Get rates',
  SETTINGS = 'Settings',
  SYSTEM_INFO = 'System info',
  VIEW_LOGS = 'View logs',
  MAIN_SCREEN = 'Main screen',
  REMINDER = 'REMINDER',
  TURN_ON_HOURLY_UPDATES = 'Turn on hourly updates',
  TURN_ON_DAILY_UPDATES = 'Turn on daily updates',
  TURN_OFF_DAILY_UPDATES = 'Turn off daily updates',
  TURN_OFF_HOURLY_UPDATES = 'Turn off hourly updates',
  SETTINGS_INFO = 'Settings info',
  SET_USER_UTC_OFFSET = 'Set utc offset',
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
const setUserUtcOffsetButton = getReplyButton(Button.SET_USER_UTC_OFFSET);
const turnOffHourlyUpdateButton = getReplyButton(
  Button.TURN_OFF_HOURLY_UPDATES,
);

const turnOnDailyUpdateButton = getReplyButton(Button.TURN_ON_DAILY_UPDATES);
const turnOffDailyUpdateButton = getReplyButton(Button.TURN_OFF_DAILY_UPDATES);

const getSettingsInfo = getReplyButton(Button.SETTINGS_INFO);

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

const settingsReplyKeyboard = (user: UserDTO) => {
  const hourlyUpdateButton = user.isHourlyUpdateEnabled
    ? turnOffHourlyUpdateButton
    : turnOnHourlyUpdateButton;

  const dailyUpdateButton = user.isDailyUpdateEnabled
    ? turnOffDailyUpdateButton
    : turnOnDailyUpdateButton;

  return getReplyKeyboard([
    [setUserUtcOffsetButton],
    [hourlyUpdateButton],
    [dailyUpdateButton],
    [getSettingsInfo],
    [mainScreenButton],
  ]);
};

export const keyboards = {
  adminReplyKeyboard,
  defaultAdminReplyKeyboard,
  defaultUserReplyKeyboard,
  settingsReplyKeyboard,
};
