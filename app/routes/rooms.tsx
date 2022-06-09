// this is just an example. No need to copy/paste this 😄
import type { Room } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { db } from '~/utils/db.server'

type LoaderData = Room[]

export const loader: LoaderFunction = async () => {
  const rooms = await db.room.findMany()

  return rooms
}

export default function Users() {
  const rooms = useLoaderData<LoaderData>()
  return (
    <ul>
      {rooms.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
