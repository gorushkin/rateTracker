import {
  type KeyboardButton,
  type ReplyKeyboardMarkup,
  type BotCommand,
  InlineKeyboardButton,
} from 'node-telegram-bot-api';

export enum Button {
  GET_RATES = 'Get rates',
  SETTINGS = 'Settings',
}

export enum Command {
  GET_RATES = 'get_rates',
  SETTINGS = 'settings',
}

const buttonCommandMapping: Record<Button, Command> = {
  [Button.GET_RATES]: Command.GET_RATES,
  [Button.SETTINGS]: Command.SETTINGS,
};


const commandButtonMapping: Record<Command, Button> = {
  [Command.GET_RATES]: Button.GET_RATES,
  [Command.SETTINGS]: Button.SETTINGS,
}

export const getCommandFromButton = (button: Button): Command =>
  buttonCommandMapping[button];

export const commands: BotCommand[] = [
  { command: Command.GET_RATES, description: 'Get rates' },
  { command: Command.SETTINGS, description: 'Get rates' },
];

const getReplyButton = (buttontext: Button): KeyboardButton => ({
  text: buttontext,
});

const getReplyKeyboard = (buttons: KeyboardButton[][]): ReplyKeyboardMarkup => {
  return {
    keyboard: buttons,
    resize_keyboard: true,
    one_time_keyboard: false,
  };
};

export const defaultReplyKeyboard = getReplyKeyboard([
  [getReplyButton(Button.GET_RATES), getReplyButton(Button.SETTINGS)],
]);

const getRatesButton = getReplyButton(Button.GET_RATES);

const getInlineKeyboard = (buttons: InlineKeyboardButton[][]) => ({
  inline_keyboard: buttons
});
