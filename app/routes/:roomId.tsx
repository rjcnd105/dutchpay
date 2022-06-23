import { Popover } from '@headlessui/react'
import type { DebtorForItem, Payer, PayItem, Room } from '@prisma/client'
import type { DataFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useLoaderData, useOutlet, useSubmit } from '@remix-run/react'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import Icon from '~/components/ui/BgIcon'
import Button from '~/components/ui/Button'
import { Plus } from '~/components/ui/Icon'
import SvgPen from '~/components/ui/Icon/Pen'
import SvgPlus from '~/components/ui/Icon/Plus'
import Input from '~/components/ui/Input'
import { RoomD } from '~/domain/RoomD'
import useError from '~/hooks/useError'
import { message } from '~/model/Message'
import { db } from '~/utils/db.server'
import stringUtils from '~/utils/stringUtils'

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

export async function action(args: DataFunctionArgs) {
  const { request } = args
  const form = await request.formData()
  const _action = form.get('_action')

  if (!stringUtils.isNotEmptyStr(_action)) return

  switch (_action) {
    case 'roomNameModify': {
      const roomId = form.get('roomId')
      const roomName = form.get('roomName')

      if (!stringUtils.isNotEmptyStr(roomName) || !stringUtils.isNotEmptyStr(roomId)) return

      return {
        _action: 'roomNameModify',
        data: await db.room.update({
          where: {
            id: roomId,
          },
          data: {
            name: roomName,
          },
        }),
      }
    }
  }

  return null
}

export type OutletData = {
  room: Room
  payers: Payer[]
  payItems: PayItem[]
}

export default function RoomBy() {
  const [controlledVisible, setControlledVisible] = useState(false)
  const submit = useSubmit()

  const room = useLoaderData<AllRoomData>()

  const [roomNameEditMode, setRoomNameEditMode] = useState(false)
  const [newRoomName, setNewRoomName] = useState(room.name)
  const [selectedPayer, setSelectedPayer] = useState(room.payers[0])
  const newRoomNameError = useError(RoomD.validator.name(newRoomName))

  const outlet = useOutlet()

  const handleSaveRoomName = useCallback(() => {
    const formData = new FormData()
    formData.set('_action', 'roomNameModify')
    submit(formData, { method: 'patch' })
  }, [])

  return outlet ? (
    <Outlet context={room} />
  ) : (
    <div className="relative flex flex-col h-full">
      <header className="relative z-20 bg-white">
        {roomNameEditMode ? (
          <Form
            className="room-title-edit flex justify-between px-16"
            method="patch"
            onSubmit={() => {
              setRoomNameEditMode(false)
            }}>
            <Button
              type="button"
              onClick={() => {
                setRoomNameEditMode(false)
              }}>
              취소
            </Button>
            <Input
              className="text-center mx-16"
              placeholder="원하는 영수증 제목"
              name="roomName"
              hasClear={false}
              value={newRoomName}
              onChange={e => setNewRoomName(e.target.value)}
            />
            <Button type="submit" className="text-primary400" disabled={!!newRoomNameError.error}>
              <span className="underline">저장</span>
            </Button>
            <input type="hidden" name="roomId" value={room.id} />
            <input type="hidden" name="_action" value="roomNameModify" />
          </Form>
        ) : (
          <div className="room-title">
            <Button onClick={() => setRoomNameEditMode(true)}>
              <span className="text-primary500 underline underline-offset-1">{room.name}</span>
              <SvgPen className="stroke-grey300" />
            </Button>
          </div>
        )}
      </header>
      <nav className="min-h-56 overflow-x-scroll">
        <div className="flex gap-x-8 nav-contents pl-20">
          <Button theme="ghost/lightblue" className="w-48">
            <SvgPlus className="stroke-primary300" />
          </Button>
          {room.payers.map(payer => {
            const isSelected = payer.id === selectedPayer.id
            return (
              <Button
                key={payer.id}
                theme={isSelected ? 'chip/blue' : 'chip/lightgrey'}
                className={clsx(isSelected && 'font-semibold')}
                onClick={() => setSelectedPayer(payer)}
                hasClose={false}>
                {payer.name}
              </Button>
            )
          })}
        </div>
      </nav>
      <main className="flex flex-col flex-auto">
        <div className="empty-pay-items flex flex-col flex-auto items-center justify-center">
          <img src="/images/main_illustrate.svg" alt="main_illustrate" />
          <p className="mt-16">등록한 내역이 없어!</p>
          <Button className="mt-48 min-w-[112px]" theme="solid/subOrange">
            <SvgPlus className="stroke-white"></SvgPlus>내역 추가
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
