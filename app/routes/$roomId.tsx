import type { Payer, PayItem, Room } from '@prisma/client';
import type { DataFunctionArgs, SerializeFrom } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import {
  Outlet,
  useLoaderData,
  useLocation,
  useMatches,
  useOutlet,
  useParams,
} from '@remix-run/react';

import RoomHeader from '~/routes/__components/__RoomHeader';
import pathGenerator from '~/service/pathGenerator';
import { db } from '~/utils/db.server';

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
          payItems: {
            orderBy: {
              id: 'asc',
            },
          },
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

export type Loader = typeof loader;
type MyLoaderData = SerializeFrom<typeof loader>;

export type OutletContextData = AllRoomData;

export default function RoomBy() {
  const room = useLoaderData<AllRoomData>();
  const matches = useMatches();
  console.log('$roomId.tsx', 'matches', matches);

  const location = useLocation();
  const { roomId } = useParams();

  return (
    <div className="relative flex flex-col h-full">
      {roomId && !location.pathname.includes(pathGenerator.room.addItem({ roomId })) && (
        <RoomHeader roomName={room.name} roomId={room.id} />
      )}
      <Outlet context={room} />
    </div>
  );
}
