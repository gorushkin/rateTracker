import TelegramBot, { SendBasicOptions } from 'node-telegram-bot-api';
import { Command, commands, getReplyParams } from '../keyboards/keyboards';
import { getActionController, getRouteController } from './libs/routesHelper';
import { userService } from '../services/users';
import { log } from '../utils';
import { context, UserAction } from '../utils/context';
import { Controller, ControllerFunction } from '../controllers/controller';
import { AppError, AuthenticationError } from '../utils/errors';
import { User } from '../services/user';

export class Routes {
  private controller = new Controller();

  constructor(private bot: TelegramBot) {
    void bot.setMyCommands(commands);

    this.addOnMessageHandler(bot);
    this.addOnCallBackQueryHandler(bot);
  }

  private actionMap = {
    [Command.SETTINGS]: UserAction.SET_USER_UTC_OFFSET,
    [Command.GET_RATES]: UserAction.GETTING_RATES,
    [Command.START]: UserAction.START,
    [Command.REGISTER]: UserAction.REGISTER,
    [Command.SYSTEM_INFO]: UserAction.DEFAULT,
    [Command.SET_OFFSET]: UserAction.SET_USER_UTC_OFFSET,
  };

  private routeMap: Record<
    UserAction,
    {
      options: (user?: User | null) => SendBasicOptions;
      controller: ControllerFunction;
    }
  > = {
    [UserAction.SET_USER_UTC_OFFSET]: {
      controller: this.controller.setUserUtcOffset,
      options: getReplyParams.getDefaultEmptyParams,
    },
    [UserAction.GETTING_RATES]: {
      controller: this.controller.getRates,
      options: getReplyParams.getDefaultParams,
    },
    [UserAction.DEFAULT]: {
      controller: this.controller.defaultReply,
      options: getReplyParams.getDefaultParams,
    },
    [UserAction.START]: {
      controller: this.controller.start,
      options: getReplyParams.getDefaultEmptyParams,
    },
    [UserAction.REGISTER]: {
      controller: this.controller.registerUser,
      options: getReplyParams.getDefaultEmptyParams,
    },
    [UserAction.SYSTEM_INFO]: {
      controller: this.controller.registerUser,
      options: getReplyParams.getDefaultEmptyParams,
    },
    [UserAction.SAVE_USER_UTC_OFFSET]: {
      controller: this.controller.saveUserUtcOffset,
      options: getReplyParams.getDefaultParams,
    },
    [UserAction.SHOW_SETTINGS]: {
      controller: this.controller.showSettings,
      options: getReplyParams.getDefaultParams,
    },
  };

  private getRoute = (props: { message?: string; id: number }): UserAction => {
    const { message, id } = props;
    const userAction = context.getAction(id);

    const action = this.actionMap[message as Command] ?? UserAction.DEFAULT;

    return userAction ?? action;
  };

  private handleMessage = async (params: {
    id: number;
    message?: string;
    username?: string;
  }) => {
    const { id, message = '', username = '' } = params;

    const user = await userService.getUser(id);

    const route = this.getRoute({ message, id });

    const { controller, options } = this.routeMap[route];

    const payload = { id, username, data: message };

    const optionsKeyboard = options(user);

    try {
      const response = await controller(payload);

      this.bot.sendMessage(id, response, optionsKeyboard);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return this.bot.sendMessage(
          id,
          error.message,
          getReplyParams.getRegisterParams(),
        );
      }

      const message =
        error instanceof AppError ? error.message : 'Something went wrong';

      return this.bot.sendMessage(
        id,
        message,
        getReplyParams.getDefaultParams(user),
      );
    }
  };

  private addOnMessageHandler = (bot: TelegramBot) => {
    bot.on('message', (msg) =>
      this.handleMessage({
        id: msg.chat.id,
        message: msg.text,
        username: msg.chat.username,
      }),
    );
  };

  private addOnCallBackQueryHandler = (bot: TelegramBot) => {
    bot.on('callback_query', async (query) => {
      this.handleMessage({ id: query.from.id, message: query.data });
    });
  };
}
