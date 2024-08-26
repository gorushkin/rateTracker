import { BotController } from '../controllers';
import { User } from './user';

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
