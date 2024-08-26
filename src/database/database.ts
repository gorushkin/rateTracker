import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export class UserDB {
  user: Prisma.UserDelegate<DefaultArgs>;

  constructor(db: PrismaClient) {
    this.user = db.user;
  }

  checkUser = (id: number): Promise<boolean> => {
    throw new Error('Not implemented');
  };

  addUser = async (id: number, username: string = ''): Promise<User> => {
    const user = await this.getUser(id);

    if (user) return user;

    const length = await this.user.count();

    const role = length === 0 ? 'admin' : 'user';

    const newUser = await this.user.create({
      data: {
        username,
        role,
        id,
      },
    });

    return newUser;
  };

  getUser = (id: number): Promise<User | null> => {
    return this.user.findUnique({ where: { id } });
  };

  getUsers = (): Promise<User[]> => {
    return this.user.findMany();
  };

  updateUser = async (id: number, data: Partial<User>): Promise<User> => {
    const user = await this.user.update({
      where: { id },
      data,
    });

    return user;
  };
}

export const userDB = new UserDB(prisma);
