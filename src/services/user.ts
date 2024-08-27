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
  users: UserDB = userDB;

  constructor(data: UserDTO) {
    this.id = data.id;
    this.username = data.username;
    this.role = data.role;
    this.isHourlyUpdateEnabled = data.isHourlyUpdateEnabled;
    this.isDailyUpdateEnabled = data.isDailyUpdateEnabled;
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
