import { Portal } from '@headlessui/react';
import type { Room } from '@prisma/client';
import { useFetcher } from '@remix-run/react';
import { useCallback, useState } from 'react';

import Button from '~/components/ui/Button';
import SvgPen from '~/components/ui/Icon/Pen';
import Input from '~/components/ui/Input';
import { RoomD } from '~/domain/RoomD';
import useError from '~/hooks/useError';

export type RoomHeaderProps = {
  roomName: Room['name'];
  roomId: Room['id'];
  Left?: JSX.Element;
  Right?: JSX.Element;
};
export default function RoomHeader({
  roomName,
  roomId,
  Left,
  Right,
}: RoomHeaderProps) {
  const fetcher = useFetcher();
  const [roomNameEditMode, _setRoomNameEditMode] = useState(false);
  const [newRoomName, setNewRoomName] = useState(roomName);
  const newRoomNameError = useError(RoomD.nameDecode(newRoomName));
  const setRoomNameEditMode = useCallback((v: boolean) => {
    _setRoomNameEditMode(v);

    if (v)
      setTimeout(
        () =>
          (
            document.querySelector(
              'input[name=roomName]',
            ) as HTMLInputElement | null
          )?.focus(),
        100,
      );

    setNewRoomName(roomName);
  }, []);
  const onRoomNameEditMode = useCallback(() => setRoomNameEditMode(true), []);
  const offRoomNameEditMode = useCallback(() => setRoomNameEditMode(false), []);

  return (
    <header className="relative z-20 bg-white h-48">
      {roomNameEditMode ? (
        <div className="h-full">
          <fetcher.Form
            action="/api/roomNameModify"
            className="room-title-edit flex h-full items-center px-12"
            method="patch"
            onSubmit={offRoomNameEditMode}>
            <Button
              type="button"
              className="h-[44px] min-w-[44px] text-darkgrey300"
              onClick={offRoomNameEditMode}>
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
            <Button
              type="submit"
              className="text-primary400 h-[44px] min-w-[44px]"
              disabled={!!newRoomNameError.err}>
              <span className="underline underline-offset-1">저장</span>
            </Button>
            <input type="hidden" name="roomId" value={roomId} />
          </fetcher.Form>

          <Portal>
            <div
              className="dimm absolute z-10 inset-0 bg-black/40 animate-fadeIn"
              tabIndex={-1}
              role="none"
            />
            <div
              className="blur-dimm absolute z-10 inset-0 backdrop-blur-sm animate-fadeIn"
              tabIndex={-1}
              role="none"
            />
          </Portal>
        </div>
      ) : (
        <div className="room-title flex justify-between px-12">
          <div className="flex flex-1">{Left}</div>
          <Button
            className="px-32 w-[max-content]"
            theme="text"
            onClick={onRoomNameEditMode}>
            <span className="text-primary500 underline underline-offset-1">
              {roomName}
            </span>
            <SvgPen className="stroke-grey300" />
          </Button>
          <div className="flex flex-1 justify-end">{Right}</div>
        </div>
      )}
    </header>
  );
}
