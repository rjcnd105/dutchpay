import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function deleteEmptyPayItems() {
  return db.payItem.deleteMany({
    where: {
      name: '',
      amount: 0,
    },
  });
}

deleteEmptyPayItems().then(console.log);
