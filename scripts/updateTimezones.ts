import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTimezones() {
  await prisma.user.updateMany({
    where: { utcOffset: null },
    data: { utcOffset: '+03:00' },
  });

  console.log('Timezones updated');
}

updateTimezones()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
