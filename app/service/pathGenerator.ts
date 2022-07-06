import type { Payer } from '@prisma/client';
import { flow, pipe } from 'fp-ts/lib/function';
import * as Semi from 'fp-ts/lib/Semigroup';
import * as S from 'fp-ts/string';

import { additionSearchParams, makePathGenerator } from '~/utils/makePathGenerator';

export const pathGenerator = {
  rending: makePathGenerator('/'),
  room: {
    addItem: makePathGenerator('/:roomId/addItem'),
    calculate: makePathGenerator('/:roomId/calculate'),
    result: makePathGenerator('/:roomId/result'),
  },
} as const;

export default pathGenerator;
