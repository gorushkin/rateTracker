import TelegramBot from 'node-telegram-bot-api';
import { BotController } from '../controllers';
import { Button, commands } from '../keyboards';

export const addRoutes = async (bot: TelegramBot) => {
  const botController = new BotController(bot);

  void bot.setMyCommands(commands);

  bot.on('message', (msg: TelegramBot.Message) => {
    console.log('msg: ', msg.text);

    if (msg.text === Button.GET_RATES) {
      return botController.onGetRates(msg);
    }

    botController.defaultResponse(msg);
  });
};
