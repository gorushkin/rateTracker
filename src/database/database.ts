import { DEFAULT_TIMEZONE_OFFSET } from '../config';
import { db, UserDTO, users } from '../db';
import { eq } from 'drizzle-orm';

export class UserDB {
  users = users;
  db = db;

  checkUser = (id: number): Promise<boolean> => {
    throw new Error('Not implemented');
  };

  addUser = async (id: number, username: string = ''): Promise<UserDTO> => {
    const users = await this.getUsers();

    const user = await this.getUser(id);

    if (!!user) {
      return user;
    }

    const length = users.length;

    const role = length === 0 ? 'admin' : 'user';

    const [newUser] = await this.db
      .insert(this.users)
      .values({
        id,
        username,
        role,
        utcOffset: DEFAULT_TIMEZONE_OFFSET,
      })
      .returning();

    return newUser;
  };

  getUser = async (id: number): Promise<UserDTO | null> => {
    const users = await this.db
      .select()
      .from(this.users)
      .where(eq(this.users.id, id))
      .execute();

    const user = users[0];

    return user || null;
  };

  getUsers = (): Promise<UserDTO[]> => {
    return this.db.select().from(this.users).execute();
  };

  updateUser = async (id: number, data: Partial<UserDTO>): Promise<UserDTO> => {
    const updatedUser = await this.db
      .update(this.users)
      .set(data)
      .where(eq(this.users.id, id))
      .returning();

    return updatedUser[0];
  };
}

export const userDB = new UserDB();
