import type { DebtorForItem, Payer, PayItem, Room } from '@prisma/client'
import type { DataFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData, useOutlet } from '@remix-run/react'
import { useRef, useState } from 'react'
import { Outlet, useParams } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper } from 'swiper/types'

import Icon from '~/components/ui/BgIcon'
import Button from '~/components/ui/Button'
import { Plus } from '~/components/ui/Icon'
import SvgPen from '~/components/ui/Icon/Pen'
import Input from '~/components/ui/Input'
import { db } from '~/utils/db.server'

type AllRoomData = Room & {
  payers: Array<Payer & { payItems: PayItem[] }>
  payItems: Array<PayItem & { debtorForItems: DebtorForItem[] }>
}

const getAllRoomData = (roomId: Room['id']) =>
  db.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      payers: {
        include: {
          payItems: true,
        },
      },
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

export type OutletData = {
  room: Room
  payers: Payer[]
  payItems: PayItem[]
}

export default function RoomBy() {
  const data = useLoaderData<AllRoomData>()
  const [roomNameEditMode, setRoomNameEditMode] = useState(false)
  const { id: roomId, name: roomName, payers, payItems } = data
  const swiper = useRef<Swiper | null>(null)

  const outlet = useOutlet()

  return outlet ? (
    <Outlet context={data} />
  ) : (
    <div className="relative flex flex-col h-full">
      <header className="relative z-20 bg-white">
        {roomNameEditMode ? (
          <div className="room-title-edit flex px-16">
            <Button onClick={() => setRoomNameEditMode(false)}>취소</Button>
            <Input className="text-center max-w-[180px] mx-auto" borderNone placeholder="원하는 영수증 제목" />
            <Button className="text-primary400 underline">저장</Button>
          </div>
        ) : (
          <div className="room-title">
            <Button onClick={() => setRoomNameEditMode(true)}>
              {roomName}
              <SvgPen />
            </Button>
          </div>
        )}
      </header>
      <nav>
        <Swiper
          threshold={5}
          grabCursor={true}
          onSwiper={swiperIns => {
            swiper.current = swiperIns
          }}></Swiper>
      </nav>
      <main className="flex flex-col flex-auto">
        <div className="empty-pay-items flex flex-col flex-auto items-center justify-center">
          <img src="/images/main_illustrate.svg" alt="main_illustrate" />
          <p className="mt-16">등록한 내역이 없어!</p>
          <Button className="mt-48 min-w-[112px]" theme="solid/subOrange">
            <Plus className="stroke-white"></Plus>내역 추가
          </Button>
        </div>
      </main>
      {roomNameEditMode && (
        <>
          <div className="dimm absolute z-10 inset-0 bg-black/40" tabIndex={-1} role="none" />
          <div className="blur-dimm absolute z-10 inset-0 backdrop-blur-sm" tabIndex={-1} role="none" />
        </>
      )}
    </div>
  )
}
