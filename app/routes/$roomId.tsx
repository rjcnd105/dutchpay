import type { Room } from '@prisma/client';
import type { SerializeFrom } from '@remix-run/node';
import { Outlet, useLocation, useMatches, useParams } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import type { LoaderArgs } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/node';
import type { UseDataFunctionReturn } from 'remix-typedjson/dist/remix';
import { RoomD } from '~/domain/RoomD';
import * as E from '@fp-ts/core/Either';
import * as O from '@fp-ts/core/Option';
import * as Z from '@effect/io/Effect';
import { flow, pipe } from '@fp-ts/core/Function';
import { decode } from '@fp-ts/schema';
import * as ID from '@fp-ts/core/Identity';
import { filterNilO } from '~/utils/fpUtils';
import { getOrThrow } from '@fp-ts/core/Option';

const getAllRoomData = (roomId: Room['id']) =>
  db.room.findUnique({
    where: {
      id: roomId,
    },
  });

export type OutletContextData = UseDataFunctionReturn<typeof getAllRoomData>;

const loaderFn = flow(
  decode(RoomD.idSchema),
  O.fromEither,
  ID.map(async result =>
    pipe(
      result,
      O.map(getAllRoomData),
      filterNilO,
      O.match(() => {
        throw redirect('/empty');
      }, typedjson),
    ),
  ),
);

export async function loader({ request, params }: LoaderArgs) {
  return loaderFn(params.roomId);
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
