import type { Payer } from '@prisma/client'
import { flow, pipe } from 'fp-ts/lib/function'
import * as Semi from 'fp-ts/lib/Semigroup'
import * as S from 'fp-ts/string'

import { makePathGenerator } from '~/utils/makePathGenerator'

export const pathGenerator = {
  rending: makePathGenerator('/'),
  room: {
    addItem: flow(
      makePathGenerator('/:roomId/addItem'),
      path =>
        ({ payerId }: { payerId?: Payer['id'] }) =>
          `${path}${payerId ? '?' + payerId : ''}`,
    ),
    calculate: makePathGenerator('/:roomId/calculate'),
    result: makePathGenerator('/:roomId/result'),
  },
} as const

export default pathGenerator
