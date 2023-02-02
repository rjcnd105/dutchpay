import type { Payer, PayItem } from '@prisma/client';
import type { Method } from 'app/service/api';
import { apiAction } from 'app/service/api';

import { db } from '~/utils/db.server';

const API_NAME = 'payer/addPayItemsExcept';
type API_NAME = typeof API_NAME;

type ApiMethod = Method<'post'>;

type Props = {
  payerId: Payer['id'];
  payItemIds: PayItem['id'][];
};

export const api = {
  async [API_NAME]({ payerId, payItemIds }: Props) {
    return db.$transaction([
      db.payItemForPayer.deleteMany({ where: { payerId } }),
      db.payItemForPayer.createMany({
        data: payItemIds.map(payItemId => ({ payerId, payItemId })),
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
