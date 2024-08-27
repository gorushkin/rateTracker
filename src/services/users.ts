import { userDB, UserDB } from '../database/database';
import { User } from './user';

export class UserService {
  users: UserDB = userDB;

  constructor() {}

  addUser = async (id: number, username: string = ''): Promise<User> => {
    const user = await this.users.addUser(id, username);
    return new User(user);
  };

  getUser = async (id: number): Promise<User | null> => {
    const user = await this.users.getUser(id);

    if (!user) {
      return null;
    }

    return new User(user);
  };

  getUsers = async (): Promise<User[]> => {
    const users = await this.users.getUsers();
    return users.map((user) => new User(user));
  };

  updateUser = async (id: number, data: Partial<User>) => {
    const user = await this.users.updateUser(id, data);
    return new User(user);
  };
}

export const userService = new UserService();
