import TelegramBot, { ReplyKeyboardMarkup } from 'node-telegram-bot-api';
import { defaultReplyKeyboard } from '../keyboards';
import { getRates } from '../api';

class BotController {
  bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;
  }

  sendMessage = (
    id: number,
    message: string,
    keyboard: ReplyKeyboardMarkup,
  ) => {
    this.bot.sendMessage(id, message, {
      reply_markup: {
        ...keyboard,
      },
    });
  };

  onGetRates = async (msg: TelegramBot.Message) => {
    const id = msg.chat.id;

    const rates = await getRates();

    const date = new Date().toUTCString();

    const ratesString = rates
      .map(({ currency, rate }) => `${currency}: ${rate}`)
      .join('\n');

    const message = `Rates at ${date}:\n\n${ratesString}`;

    this.sendMessage(id, message, defaultReplyKeyboard);
  };

  defaultResponse = (msg: TelegramBot.Message) => {
    const id = msg.chat.id;

    this.sendMessage(id, "let's do something!", defaultReplyKeyboard);
  };
}

export { BotController };
