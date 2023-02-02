import type { Payer, PayItem } from '@prisma/client';
import type { Method } from 'app/service/api';
import { apiAction } from 'app/service/api';

import { db } from '~/utils/db.server';

const API_NAME = 'payItem/removeExceptPayer';
type API_NAME = typeof API_NAME;

type ApiMethod = Method<'post'>;

type Props = {
  payItemId: PayItem['id'];
  payerId: Payer['id'];
};

export const api = {
  async [API_NAME]({ payItemId, payerId }: Props) {
    return db.payItemForPayer.delete({
      where: {
        payerId_payItemId: {
          payItemId,
          payerId,
        },
      },
    });
  },
};

export const action = apiAction(API_NAME, api[API_NAME]);

declare module 'app/service/api' {
  export interface ApiFns {
    readonly [API_NAME]: (typeof api)[API_NAME] & ApiMethod;
  }
}
