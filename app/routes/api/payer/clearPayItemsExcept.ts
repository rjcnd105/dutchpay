import type { Payer } from '@prisma/client';
import type { Method } from 'app/service/api';
import { apiAction } from 'app/service/api';

import { db } from '~/utils/db.server';

const API_NAME = 'payer/clearPayItemsExcept';
type API_NAME = typeof API_NAME;

type ApiMethod = Method<'post'>;

type Props = {
  payerId: Payer['id'];
};

export const api = {
  async [API_NAME]({ payerId }: Props) {
    return db.exceptedPayItemsForPayers.deleteMany({
      where: {
        payerId
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
