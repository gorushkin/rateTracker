import { ReplyKeyboardMarkup } from 'node-telegram-bot-api';
import { BotController } from '../../controllers';
import { Dayjs } from 'dayjs';
import { compareTime } from '../../scheduler/utils';

export type Role = 'admin' | 'user';

const DAILY_UPDATE_TIME = '06:00';

export class User {
  isHourlyUpdateEnabled: boolean = false;
  isDailyUpdateEnabled: boolean = false;
  private dailyUpdateTime: string = DAILY_UPDATE_TIME;

  constructor(
    public id: number,
    public botController: BotController,
    public username: string,
    public role: Role = 'user',
  ) {}

  private shouldUserBeUpdated = (time: Dayjs) => {
    const isReadyForDailyUpdate = this.checkIsReadyForDailyUpdate(time);
    const isReadyForHourlyUpdate = this.checkIsReadyForHourlyUpdate();

    return isReadyForDailyUpdate || isReadyForHourlyUpdate;
  };

  private checkIsReadyForDailyUpdate = (time: Dayjs) => {
    const isUserReadyForDailyUpdate = compareTime(this.dailyUpdateTime, time);

    return isUserReadyForDailyUpdate;
  };

  private checkIsReadyForHourlyUpdate = () => {
    return this.isHourlyUpdateEnabled;
  };

  toggleOnHourlyUpdate = () => {
    this.isHourlyUpdateEnabled = !this.isHourlyUpdateEnabled;
    return this.isHourlyUpdateEnabled;
  };

  toggleOnDailyUpdate = () => {
    this.isDailyUpdateEnabled = !this.isDailyUpdateEnabled;
    return this.isDailyUpdateEnabled;
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

  updateUserRates = (time: Dayjs) => {
    const shouldUserBeUpdated = this.shouldUserBeUpdated(time);

    if (shouldUserBeUpdated) {
      this.sendRates();
    }
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
