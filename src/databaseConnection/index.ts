import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const initDB = async () => {
  try {
    await prisma.$connect();


  } catch (error) {
    console.error(error);
  }
};
