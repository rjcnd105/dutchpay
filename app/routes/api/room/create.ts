import type { Room } from '@prisma/client';
import type { Method } from 'app/service/api';
import { apiAction } from 'app/service/api';

import { message } from '~/model/Message';
import { db } from '~/utils/db.server';

const API_NAME = 'room/create';
type API_NAME = typeof API_NAME;

type ApiMethod = Method<'post'>;

type Props = {
  names: Array<Room['name']>;
};

const api = {
  [API_NAME]({ names }: Props) {
    if (names.length === 0) {
      return message({
        status: 'error',
        text: '이름이 입력되지 않았음',
      });
    }

    return db.room.create({
      data: {
        name: '정산',
        payers: {
          create: names.map(payerName => ({
            name: payerName,
          })),
        },
      },
    });
  },
};

export const action = apiAction(API_NAME, api[API_NAME]);

declare module 'app/service/api' {
  export interface ApiFns {
    readonly [API_NAME]: typeof api[API_NAME] & ApiMethod;
  }
}
