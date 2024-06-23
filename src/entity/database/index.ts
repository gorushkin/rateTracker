export type Role = 'admin' | 'user';

export class User {
  autoSendRates: boolean = false;

  constructor(
    public id: number,
    public username: string,
    public role: Role = 'user',
  ) {}

  private setAutoSendRates = (autoSendRates: boolean) => {
    this.autoSendRates = autoSendRates;
  };

  turnOnAutoSendRates = () => {
    this.setAutoSendRates(true);
  };

  turnOffAutoSendRates = () => {
    this.setAutoSendRates(false);
  };

  isAdmin = () => {
    return this.role === 'admin';
  };
}

export class DB {
  db: Map<number, User> = new Map();

  checkUser = (id: number) => {
    return !!this.db.has(id);
  };

  addUser = (id: number, username: string = '') => {
    const user = this.db.get(id);

    if (user) {
      return user;
    }

    const role = this.db.size === 0 ? 'admin' : 'user';

    const newUser = new User(id, username, role);

    this.db.set(id, new User(id, username, role));

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
}

export const db = new DB();
