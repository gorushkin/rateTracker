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
  BACK = 'BACK',
}

export enum Command {
  GET_RATES = 'get_rates',
  SETTINGS = 'settings',
}

const compareCommand = (command: Command) => (text?: string) =>
  text === `/${command}`;

export const isGetRates = compareCommand(Command.GET_RATES);

export const isSettings = compareCommand(Command.SETTINGS);

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

const getReplyKeyboard = (buttons: KeyboardButton[][]): ReplyKeyboardMarkup => {
  return {
    keyboard: buttons,
    resize_keyboard: true,
    one_time_keyboard: false,
  };
};

const getUserButtons = (user: User) => [
  [getRatesButton, getSettingsButton],
  ...(user.isAdmin() ? [[getSystemInfoButton]] : [[]]),
];

const AdminButtons = [[getSystemInfoButton, getLogsButton]];

export const getDefaultReplyKeyboard = (user: User) =>
  getReplyKeyboard(getUserButtons(user));

export const getAdminReplyKeyboard = () => getReplyKeyboard(AdminButtons);
