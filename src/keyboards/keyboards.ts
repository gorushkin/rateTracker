import {
  type KeyboardButton,
  type ReplyKeyboardMarkup,
  type SendMessageOptions,
  type SendBasicOptions,
  type BotCommand,
  type InlineKeyboardButton,
} from 'node-telegram-bot-api';
import { User } from '../services/user';

export enum Command {
  GET_RATES = 'get_rates',
  SETTINGS = 'settings',
  REGISTER = 'register',
  START = '/start',
  SYSTEM_INFO = 'system_info',
  SET_OFFSET = 'set_offset',
}

const ButtonTextMap: Record<Command, string> = {
  [Command.GET_RATES]: 'Get rates',
  [Command.SETTINGS]: 'Settings',
  [Command.REGISTER]: 'Register',
  [Command.START]: '/start',
  [Command.SYSTEM_INFO]: 'System info',
  [Command.SET_OFFSET]: 'Set offset',
};

type GetMarkupKeyboard = (user?: User) => ReplyKeyboardMarkup;

const getReplyButton = (command: Command): KeyboardButton => {
  const text = command;
  return { text };
};

export const commands: BotCommand[] = [
  { command: Command.GET_RATES, description: 'Get rates' },
  { command: Command.SETTINGS, description: 'Get rates' },
];

const registerReplyButton = getReplyButton(Command.REGISTER);
const getRatesReplyButton = getReplyButton(Command.GET_RATES);
const getSystemInfoReplyButton = getReplyButton(Command.SYSTEM_INFO);
const getSetOffsetButton = getReplyButton(Command.SET_OFFSET);

const getRegisterKeyboard: GetMarkupKeyboard = () => ({
  keyboard: [[registerReplyButton]],
  resize_keyboard: true,
});

const getDefaultKeyboard: GetMarkupKeyboard = (user?: User) => ({
  keyboard: [
    [
      getRatesReplyButton,
      getSetOffsetButton,
      ...(user?.isAdmin ? [getSystemInfoReplyButton] : []),
    ],
  ],
  resize_keyboard: true,
});

const getDefaultEmptyKeyboard: GetMarkupKeyboard = () => {
  return { keyboard: [[]], resize_keyboard: true };
};

type KeyboardsParams = {
  inline_keyboard?: InlineKeyboardButton[][];
  keyboard?: KeyboardButton[][];
};

const getSendMessageOptions =
  (isMarkdown: boolean) =>
  (keyboards: KeyboardsParams = {}): SendBasicOptions => {
    const { inline_keyboard, keyboard } = keyboards;

    return {
      reply_markup: {
        remove_keyboard: true,
      },
      ...(keyboards.inline_keyboard && {
        reply_markup: {
          inline_keyboard,
        },
      }),
      ...(keyboards.keyboard && {
        reply_markup: {
          keyboard,
        },
      }),
      ...(isMarkdown && { parse_mode: 'Markdown' }),
    } as SendMessageOptions;
  };

const getMarkdownOptions = getSendMessageOptions(true);

export const getRegisterParams = getMarkdownOptions(getRegisterKeyboard());
export const getDefaultEmptyParams = getMarkdownOptions();
export const getDefaultParams = getMarkdownOptions(getDefaultKeyboard());

export const getReplyParams = {
  getRegisterParams,
  getDefaultEmptyParams,
  getDefaultParams,
};
