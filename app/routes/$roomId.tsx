import type { Room } from '@prisma/client';
import type { SerializeFrom } from '@remix-run/node';
import { Outlet, useLocation, useMatches, useParams } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import type { LoaderArgs } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/node';

const getAllRoomData = (roomId: Room['id']) =>
  db.room.findUnique({
    where: {
      id: roomId,
    },
  });

export type AllRoomData = Awaited<ReturnType<typeof getAllRoomData>>;
export type OutletContextData = AllRoomData;

export async function loader({ request, params }: LoaderArgs) {
  const roomId = params.roomId;

  if (!roomId) throw redirect('/empty');

  const roomAllData = await getAllRoomData(roomId);

  return typedjson(roomAllData);
}

export default function RoomBy() {
  const room = useTypedLoaderData<typeof loader>();
  console.log('room', room);
  const matches = useMatches();

  const location = useLocation();
  const { roomId } = useParams();

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <Outlet context={room} />
    </div>
  );
}
