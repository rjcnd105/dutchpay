import type { Payer, Room } from '@prisma/client';
import type { Method } from 'app/service/api';
import { apiAction } from 'app/service/api';

import { message } from '~/module/Message';
import { db } from '~/utils/db.server';

const API_NAME = 'payer/put';
type API_NAME = typeof API_NAME;

type ApiMethod = Method<'put'>;

type Props = {
  roomId: Room['id'];
  payerNames: Array<Payer['name']>;
};

const api = {
  async [API_NAME]({ roomId, payerNames }: Props) {
    const previousRoom = await db.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        payers: true,
      },
    });

    if (!previousRoom) {
      return message({
        text: '방을 찾을 수 없습니다.',
        status: 'error',
      });
    }

    const previousPayerNames = previousRoom.payers.map(({ name }) => name);
    const [nameSet, previousNameSet] = [
      new Set(payerNames),
      new Set(previousPayerNames),
    ];

    const addPayers = [...nameSet].filter(name => !previousNameSet.has(name));
    const deletePayers = [...previousNameSet].filter(
      name => !nameSet.has(name),
    );

    return await db.$transaction([
      db.payer.deleteMany({
        where: {
          roomId,
          name: {
            in: deletePayers,
          },
        },
      }),
      db.payer.createMany({ data: addPayers.map(name => ({ roomId, name })) }),
    ]);
  },
};

export const action = apiAction(API_NAME, api[API_NAME]);

declare module 'app/service/api' {
  export interface ApiFns {
    readonly [API_NAME]: (typeof api)[API_NAME] & ApiMethod;
  }
}
