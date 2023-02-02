import { Outlet, useOutletContext } from '@remix-run/react';
import { useTypedRouteLoaderData } from 'remix-typedjson';
import type { loader as roomLoader, OutletContextData } from '../$roomId';

export default function __roomEditable() {
  const room = useOutletContext<OutletContextData>();

  console.log('room', room);
  // if (!room) throw Error('room is undefined');

  if (!room) return <div>no room bb</div>;

  return (
    <>
      {/*<RoomHeader roomName={room.name} roomId={room.id} />*/}
      <Outlet context={room} />
    </>
  );
}
