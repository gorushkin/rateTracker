import { userDB, UserDB } from '../database/database';
import { compareTime } from '../scheduler/utils';
import { Dayjs } from 'dayjs';
import { context } from '../utils/context';
import { UserDTO } from '../db';

const DAILY_UPDATE_TIME = '06:00';

export class User implements UserDTO {
  id: number;
  username: string;
  role: UserDTO['role'];
  isHourlyUpdateEnabled: boolean;
  isDailyUpdateEnabled: boolean;
  users: UserDB = userDB;
  utcOffset: number;
  private context = context;
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

  getContext = () => {
    return this.context.getAction(BigInt(this.id));
  };

  setUserUtcOffset = () => {
    return this.context.setUserUtcOffset(BigInt(this.id));
  };
}
