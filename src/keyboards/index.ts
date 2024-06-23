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

const isCommandGetRates = compareCommand(Command.GET_RATES);
const isCommandSettings = compareCommand(Command.SETTINGS);

const CompareButton = (button: Button) => (text?: string) => text === button;

const isButtonGetRates = CompareButton(Button.GET_RATES);

const isButtonSettings = CompareButton(Button.SETTINGS);

const isButtonSystemInfo = CompareButton(Button.SYSTEM_INFO);

const isButtonViewLogs = CompareButton(Button.VIEW_LOGS);

export const isRouteGetRates = (text?: string) =>
  isCommandGetRates(text) || isButtonGetRates(text);

export const isRouteSettings = (text?: string) =>
  isCommandSettings(text) || isButtonSettings(text);

export const isRouteSystemInfo = (text?: string) => isButtonSystemInfo(text);

export const isRouteViewLogs = (text?: string) => isButtonViewLogs(text);

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

const userButtons = [[getRatesButton, getSettingsButton]];

const adminButtons = [
  [getRatesButton, getSettingsButton],
  [getSystemInfoButton],
];

const adminInfoButtons = [[getSystemInfoButton, getLogsButton]];

const defaultUserReplyKeyboard = getReplyKeyboard(userButtons);

const defaultAdminReplyKeyboard = getReplyKeyboard(adminButtons);

const adminReplyKeyboard = getReplyKeyboard(adminInfoButtons);

const settingsReplyKeyboard = getReplyKeyboard([[getReplyButton(Button.BACK)]]);

export const keyboards = {
  adminReplyKeyboard,
  defaultAdminReplyKeyboard,
  defaultUserReplyKeyboard,
  settingsReplyKeyboard,
};
