import type { Payer, PayItem } from '@prisma/client';
import type { Method } from 'app/service/api';
import { apiAction } from 'app/service/api';

import { db } from '~/utils/db.server';

const API_NAME = 'payItem/update';
type API_NAME = typeof API_NAME;

type ApiMethod = Method<'patch'>;

type Props = {
  payerId: Payer['id'];
  payItem: Pick<PayItem, 'id' | 'name' | 'amount'>;
};

const api = {
  [API_NAME]({ payerId, payItem: { id, ...payItem } }: Props) {
    return db.$transaction([
      db.payItem.update({
        where: {
          id,
        },
        data: {
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
    readonly [API_NAME]: typeof api[API_NAME] & ApiMethod;
  }
}
