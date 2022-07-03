import { Portal } from '@headlessui/react'
import { Form } from '@remix-run/react'
import { useState } from 'react'

import Button from '~/components/ui/Button'
import SvgPen from '~/components/ui/Icon/Pen'
import Input from '~/components/ui/Input'
import Spacer from '~/components/ui/Spacer'
import { RoomD } from '~/domain/RoomD'
import useError from '~/hooks/useError'

import type { AllRoomData } from '../$roomId'

export type RoomHeaderProps = {
  room: AllRoomData
  Left?: ({ room }: { room?: AllRoomData }) => JSX.Element
  Right?: ({ room }: { room?: AllRoomData }) => JSX.Element
}
export default function RoomHeader({ room, Left, Right }: RoomHeaderProps) {
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
            className="room-title-edit flex h-full items-center px-12"
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
              wrapClassName="text-center mx-16"
              className="text-center"
              placeholder="원하는 영수증 제목"
              name="roomName"
              hasClear={false}
              value={newRoomName}
              onChange={e => setNewRoomName(e.target.value)}
            />
            <Button type="submit" className="text-primary400 h-[44px] min-w-[44px]" disabled={!!newRoomNameError.error}>
              <span className="underline">저장</span>
            </Button>
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
        <div className="room-title flex justify-between px-12">
          <div className="flex flex-1">{Left && <Left room={room} />}</div>
          <Button className="px-32 w-[max-content]" onClick={() => setRoomNameEditMode(true)}>
            <span className="text-primary500 underline underline-offset-1">{room.name}</span>
            <SvgPen className="stroke-grey300" />
          </Button>
          <div className="flex flex-1 justify-end">{Right && <Right room={room} />}</div>
        </div>
      )}
    </header>
  )
}
