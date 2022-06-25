import { Popover, Portal } from '@headlessui/react'
import type { DebtorForItem, Payer, PayItem, Room } from '@prisma/client'
import type { DataFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useLoaderData, useOutlet, useSubmit } from '@remix-run/react'
import clsx from 'clsx'
import type { HTMLInputElement } from 'happy-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useParams } from 'react-router'

import Icon from '~/components/ui/BgIcon'
import Button from '~/components/ui/Button'
import Drawer from '~/components/ui/Drawer'
import { Plus } from '~/components/ui/Icon'
import SvgClose from '~/components/ui/Icon/Close'
import SvgCross from '~/components/ui/Icon/Cross'
import SvgPen from '~/components/ui/Icon/Pen'
import SvgPlus from '~/components/ui/Icon/Plus'
import Input from '~/components/ui/Input'
import { RoomD } from '~/domain/RoomD'
import useError from '~/hooks/useError'
import { message } from '~/model/Message'
import pathGenerator from '~/service/pathGenerator'
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
  const url = new URL(request.url)

  const roomId = params.roomId

  if (roomId && url.pathname === `/${params.roomId}`) {
    return redirect(pathGenerator.room.addItem({ roomId }))
  }

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

export type OutletContextData = AllRoomData

export default function RoomBy() {
  const room = useLoaderData<AllRoomData>()
  return (
    <div className="relative flex flex-col h-full">
      <RoomHeader room={room} />
      <Outlet context={room} />
    </div>
  )
}

function RoomHeader({ room }: { room: AllRoomData }) {
  const [roomNameEditMode, _setRoomNameEditMode] = useState(false)
  const [newRoomName, setNewRoomName] = useState(room.name)
  const newRoomNameError = useError(RoomD.validator.name(newRoomName))
  const setRoomNameEditMode = (v: boolean) => {
    _setRoomNameEditMode(v)

    if (v)
      requestAnimationFrame(() => (document.querySelector('input[name=roomName]') as HTMLInputElement | null)?.focus())

    setNewRoomName(room.name)
  }

  return (
    <header className="relative z-20 bg-white h-48">
      {roomNameEditMode ? (
        <div className="h-full">
          <Form
            className="room-title-edit flex h-full justify-between items-center px-12"
            method="patch"
            onSubmit={() => {
              setRoomNameEditMode(false)
            }}>
            <Button
              type="button"
              className="h-[44px] min-w-[44px]"
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
            <Button type="submit" className="text-primary400 h-[44px] min-w-[44px]" disabled={!!newRoomNameError.error}>
              <span className="underline">저장</span>
            </Button>
            <input type="hidden" name="roomId" value={room.id} />
            <input type="hidden" name="_action" value="roomNameModify" />
          </Form>

          <Portal>
            <div className="dimm absolute z-10 inset-0 bg-black/40 animate-fadeIn" tabIndex={-1} role="none" />
            <div
              className="blur-dimm absolute z-10 inset-0 backdrop-blur-sm animate-fadeIn"
              tabIndex={-1}
              role="none"
            />
          </Portal>
        </div>
      ) : (
        <div className="room-title flex justify-center">
          <Button className="px-32 w-[max-content]" onClick={() => setRoomNameEditMode(true)}>
            <span className="text-primary500 underline underline-offset-1">{room.name}</span>
            <SvgPen className="stroke-grey300" />
          </Button>
        </div>
      )}
    </header>
  )
}
