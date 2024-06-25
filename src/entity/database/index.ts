import TelegramBot, { ReplyKeyboardMarkup } from 'node-telegram-bot-api';
import { BotController } from '../../controllers';

export type Role = 'admin' | 'user';

export class User {
  isHourlyUpdateEnabled: boolean = false;

  constructor(
    public id: number,
    public botController: BotController,
    public username: string,
    public role: Role = 'user',
  ) {}

  toggleOnHourlyUpdate = () => {
    this.isHourlyUpdateEnabled = !this.isHourlyUpdateEnabled;
    return this.isHourlyUpdateEnabled;
  };

  isAdmin = () => {
    return this.role === 'admin';
  };

  sendMessage = (message: string, keyboard: ReplyKeyboardMarkup) => {
    this.botController.bot.sendMessage(this.id, message, {
      reply_markup: {
        ...keyboard,
      },
    });
  };

  sendRates = () => {
    this.botController.onGetRates(this);
  };
}

export class DB {
  db: Map<number, User> = new Map();

  checkUser = (id: number) => {
    return !!this.db.has(id);
  };

  addUser = (
    id: number,
    username: string = '',
    botController: BotController,
  ) => {
    const user = this.db.get(id);

    if (user) {
      return user;
    }

    const role = this.db.size === 0 ? 'admin' : 'user';

    const newUser = new User(id, botController, username, role);

    this.db.set(id, newUser);

    return newUser;
  };

  getUser = (id: number) => {
    const user = this.db.get(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  };

  showInfo = () => {
    return [...this.db.values()].map(({ id, username, role }) => ({
      id,
      username,
      role,
    }));
  };

  getUsers = () => {
    return [...this.db.values()];
  };
}

export const db = new DB();
