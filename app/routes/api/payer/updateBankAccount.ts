import type { Payer } from '@prisma/client';
import type { Method } from 'app/service/api';
import { apiAction } from 'app/service/api';

import { db } from '~/utils/db.server';

const API_NAME = 'payer/updateBankAccount';
type API_NAME = typeof API_NAME;

type ApiMethod = Method<'patch'>;
type Props = {
  payer: Pick<Payer, 'id' | 'bankAccountNumber'>;
};

const api = {
  [API_NAME](p: Props) {
    console.log('updateBankAccount.ts', 'p', p);
    const {
      payer: { id, bankAccountNumber },
    } = p;
    return db.payer.update({
      where: {
        id,
      },
      data: {
        bankAccountNumber,
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
