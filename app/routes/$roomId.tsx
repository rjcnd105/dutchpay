import { Popover, Portal } from '@headlessui/react';
import type { Payer, PayItem, Room } from '@prisma/client';
import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useLoaderData, useLocation, useNavigate, useOutlet, useSubmit } from '@remix-run/react';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router';

import Icon from '~/components/ui/BgIcon';
import Button from '~/components/ui/Button';
import Drawer from '~/components/ui/Drawer';
import { Plus } from '~/components/ui/Icon';
import SvgClose from '~/components/ui/Icon/Close';
import SvgCross from '~/components/ui/Icon/Cross';
import SvgPen from '~/components/ui/Icon/Pen';
import SvgPlus from '~/components/ui/Icon/Plus';
import Input from '~/components/ui/Input';
import Spacer from '~/components/ui/Spacer';
import { RoomD } from '~/domain/RoomD';
import useError from '~/hooks/useError';
import { message } from '~/model/Message';
import RoomHeader from '~/routes/__components/__RoomHeader';
import pathGenerator from '~/service/pathGenerator';
import { db } from '~/utils/db.server';
import stringUtils from '~/utils/stringUtils';

export type AllRoomData = Room & {
  payers: Array<Payer & { payItems: PayItem[] }>;
  payItems: Array<PayItem>;
};

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
        },
      },
    },
  });

export async function loader({ request, params }: DataFunctionArgs) {
  const url = new URL(request.url);

  const roomId = params.roomId;

  if (roomId && `/${params.roomId}/`.includes(url.pathname)) {
    console.log('$roomId.tsx', '!');
    const path = pathGenerator.room.addItem({ roomId });
    return redirect(path);
  }

  if (!roomId) return redirect('/empty');

  const roomAllData = await getAllRoomData(roomId);

  return roomAllData ?? redirect('/empty');
}

export type OutletContextData = AllRoomData;

export default function RoomBy() {
  const room = useLoaderData<AllRoomData>();
  const location = useLocation();
  const { roomId } = useParams();
  const outlet = useOutlet();

  return (
    <div className="relative flex flex-col h-full">
      {roomId && !location.pathname.includes(pathGenerator.room.addItem({ roomId })) && <RoomHeader room={room} />}
      <Outlet context={room} />
    </div>
  );
}
