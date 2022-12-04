import type { Payer, PayItem } from '@prisma/client';
import type { Method } from 'app/service/api';
import { apiAction } from 'app/service/api';

import { db } from '~/utils/db.server';

const API_NAME = 'payItem/addExceptPayer';
type API_NAME = typeof API_NAME;

type ApiMethod = Method<'post'>;

type Props = {
  payerId: Payer['id'];
  payItemId: PayItem['id'];
};

export const api = {
  async [API_NAME](props: Props) {

    return db.exceptedPayItemsForPayers.upsert({
      where:{
        payerId_payItemId: props
      },
      update: {},
      create: props
    })
  },
};

export const action = apiAction(API_NAME, api[API_NAME]);

declare module 'app/service/api' {
  export interface ApiFns {
    readonly [API_NAME]: typeof api[API_NAME] & ApiMethod;
  }
}
