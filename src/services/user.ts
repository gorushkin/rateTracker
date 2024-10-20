import { userDB, UserDB } from '../database/database';
import { compareTime } from '../scheduler/utils';
import { Dayjs } from 'dayjs';
import { UserDTO } from '../db';
import { getUserTime } from '../routes/libs';

const DAILY_UPDATE_TIME = '06:00';

export class User implements UserDTO {
  id: number;
  username: string;
  role: UserDTO['role'];
  isHourlyUpdateEnabled: boolean;
  isDailyUpdateEnabled: boolean;
  users: UserDB = userDB;
  utcOffset: number;
  updatedAt: string;
  createdAt: string;

  constructor(data: UserDTO) {
    this.id = data.id;
    this.username = data.username;
    this.role = data.role;
    this.isHourlyUpdateEnabled = data.isHourlyUpdateEnabled;
    this.isDailyUpdateEnabled = data.isDailyUpdateEnabled;
    this.utcOffset = data.utcOffset;
    this.updatedAt = data.updatedAt;
    this.createdAt = data.createdAt;
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

  setUtcOffset = (offset: number) => {
    return this.users.updateUser(Number(this.id), { utcOffset: offset });
  };

  setUserUtcOffset = () => {
    // return this.context.saveUserUtcOffset(this.id);
    throw new Error('Method not implemented');
  };

  toString = () => {
    return `User: ${this.id}, ${this.username}, ${this.role}`;
  };

  getUserDate = (date?: Date) => {
    return getUserTime(this.utcOffset, date ?? new Date());
  };
}
