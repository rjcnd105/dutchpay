import type { DebtorForItem, Payer, PayItem, Room } from '@prisma/client'
import type { DataFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData, useOutlet } from '@remix-run/react'
import { Outlet, useParams } from 'react-router'

import { db } from '~/utils/db.server'

type AllRoomData = Room & { payers: Payer[]; payItems: (PayItem & { debtorForItems: DebtorForItem[] })[] }
const getAllRoomData = (roomId: Room['id']) =>
  db.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      payers: true,
      payItems: {
        include: {
          payer: true,
          debtorForItems: true,
        },
      },
    },
  })

export async function loader({ request, params }: DataFunctionArgs) {
  const roomId = params.roomId

  if (!roomId) return redirect('/empty')

  const roomAllData = await getAllRoomData(roomId)

  return roomAllData ?? redirect('/empty')
}

type OutletData = {
  room: Room
  payers: Payer[]
  payItems: PayItem[]
}

export default function RoomBy() {
  const data = useLoaderData<AllRoomData>()
  const { id: roomId, name: roomName, payers, payItems } = data

  const outlet = useOutlet()

  return (
    <div>
      {outlet ? (
        <Outlet context={data} />
      ) : (
        <div>
          <header></header>
          <nav></nav>
          <main>
            <img src="/images/main_illustrate.svg" alt="main_illustrate" />
          </main>
        </div>
      )}
    </div>
  )
}
