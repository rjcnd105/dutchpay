import type { Payer, PayItem, Room } from '@prisma/client';
import type { Method } from 'app/service/api';
import { apiAction } from 'app/service/api';

import { db } from '~/utils/db.server';

const API_NAME = 'payItem/create';
type API_NAME = typeof API_NAME;

type ApiMethod = Method<'post'>;

type Props = {
  roomId: Room['id'];
  payerId: Payer['id'];
  payItem: Pick<PayItem, 'name' | 'amount'>;
};

const api = {
  [API_NAME]({ roomId, payerId, payItem }: Props) {
    return db.$transaction([
      db.payItem.create({
        data: {
          roomId,
          paidPayerId: payerId,
          ...payItem,
        },
      }),
      db.payer.update({
        where: {
          id: payerId,
        },
        data: {
          paymentItemLastUpdatedDate: new Date(),
        },
      }),
    ]);
  },
};

export const action = apiAction(API_NAME, api[API_NAME]);

declare module 'app/service/api' {
  export interface ApiFns {
    readonly [API_NAME]: (typeof api)[API_NAME] & ApiMethod;
  }
}
