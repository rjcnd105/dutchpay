import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import pathGenerator from '~/service/pathGenerator';

export function loader({ params }: DataFunctionArgs) {
  return params.roomId
    ? redirect(pathGenerator.room.addItem({ roomId: params.roomId }))
    : null;
}
