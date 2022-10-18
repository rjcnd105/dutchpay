import type { Payer, PayItem, Room } from '@prisma/client';
import type { Method } from 'app/service/api';
import { apiAction } from 'app/service/api';

import { db } from '~/utils/db.server';

const API_NAME = 'payItem/exceptPayer';
type API_NAME = typeof API_NAME;

type ApiMethod = Method<'post'>;

type Props = {
  payerId: Payer['id'];
  payItemId: PayItem['id'];
};

const api = {
  [API_NAME]({ payerId, payItemId }: Props) {
    return db.payItem.update({
      where: {
        id: payItemId,
      },
      data: {
        exceptedPayers: {
          connect: {
            id: payerId,
          },
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
