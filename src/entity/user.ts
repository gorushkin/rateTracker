import { userDB, UserDB } from '../database/database';
import { PrismaClient, User as UserDTO } from '@prisma/client';
import TelegramBot, { ReplyKeyboardMarkup } from 'node-telegram-bot-api';
import { compareTime } from '../scheduler/utils';
import { Dayjs } from 'dayjs';

const DAILY_UPDATE_TIME = '06:00';

export class User implements UserDTO {
  id: bigint;
  username: string | null;
  role: string | null;
  isHourlyUpdateEnabled: boolean;
  isDailyUpdateEnabled: boolean;
  users: UserDB;

  constructor(data: UserDTO, users: UserDB) {
    this.id = data.id;
    this.username = data.username;
    this.role = data.role;
    this.isHourlyUpdateEnabled = data.isHourlyUpdateEnabled;
    this.isDailyUpdateEnabled = data.isDailyUpdateEnabled;
    this.users = users;
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  private checkIsReadyForDailyUpdate = (time: Dayjs) => {
    return compareTime(DAILY_UPDATE_TIME, time);
  };

  private checkIsReadyForHourlyUpdate = () => {
    return this.isHourlyUpdateEnabled;
  };

  shouldUserBeUpdated = (time: Dayjs) => {
    const isReadyForDailyUpdate = this.checkIsReadyForDailyUpdate(time);
    const isReadyForHourlyUpdate = this.checkIsReadyForHourlyUpdate();

    return isReadyForDailyUpdate || isReadyForHourlyUpdate;
  };

  toggleHourlyUpdates = async () => {
    const updatedUser = await this.users.updateUser(Number(this.id), {
      isHourlyUpdateEnabled: !this.isHourlyUpdateEnabled,
    });

    this.isHourlyUpdateEnabled = !this.isHourlyUpdateEnabled;

    return updatedUser;
  };

  toggleDailyUpdate = async () => {
    const updatedUser = await this.users.updateUser(Number(this.id), {
      isDailyUpdateEnabled: !this.isDailyUpdateEnabled,
    });

    this.isDailyUpdateEnabled = !this.isDailyUpdateEnabled;

    return updatedUser;
  };
}

export class UserService {
  users: UserDB;

  constructor(users: UserDB) {
    this.users = users;
  }

  addUser = async (id: number, username: string = ''): Promise<User> => {
    const user = await this.users.addUser(id, username);
    return new User(user, this.users);
  };

  getUser = async (id: number): Promise<User | null> => {
    const user = await this.users.getUser(id);

    if (!user) {
      return null;
    }

    return new User(user, this.users);
  };

  getUsers = async (): Promise<User[]> => {
    const users = await this.users.getUsers();
    return users.map((user) => new User(user, this.users));
  };

  updateUser = async (id: number, data: Partial<User>) => {
    const user = await this.users.updateUser(id, data);
    return new User(user, this.users);
  };
}

export const userService = new UserService(userDB);
