import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function seed() {
  await Promise.all(
    getRooms().map(room => {
      return db.room.create({ data: room })
    }),
  )
}

seed().then(console.log)

function getRooms() {
  return [
    {
      name: 'Road worker',
    },
    {
      name: 'Frisbee',
    },
    {
      name: 'Trees',
    },
    {
      name: 'Skeletons',
    },
    {
      name: 'Hippos',
    },
    {
      name: 'Dinner',
    },
    {
      name: 'Elevator',
    },
  ]
}
