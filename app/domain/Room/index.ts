import type { Room as RoomModel } from '@prisma/client'
import { sequenceS } from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as RE from 'fp-ts/lib/ReaderEither'

import { stringArrLiftE, stringLiftE } from '~/utils/lift'
import { foldValidatorS, singleErrorValidator } from '~/utils/validation'

export namespace Room {
  export const ERROR_TYPE = {
    최대글자수초과: '최대글자수초과',
    최소글자수미달: '최소글자수미달',
    최대인원초과: '최대인원초과',
  } as const

  const nameLengthMax = singleErrorValidator((name: RoomModel['name']) => name.length <= 16, {
    type: Room.ERROR_TYPE.최대글자수초과,
    message: '16자까지 입력 가능해',
  })
  const nameLengthMin = singleErrorValidator((name: RoomModel['name']) => name.length === 0, {
    type: Room.ERROR_TYPE.최소글자수미달,
  })
  const payerMax = singleErrorValidator((payerName: string[]) => payerName.length <= 10, {
    type: Room.ERROR_TYPE.최대인원초과,
    message: '10명까지만 가능해',
  })

  export const validator = {
    name: flow(stringLiftE, nameLengthMin, nameLengthMax, nameLengthMin),
    payers: flow(stringArrLiftE, payerMax),
  } as const

  const myValidS = {
    name: flow(stringLiftE, nameLengthMin, nameLengthMax)('aaa'),
    payers: flow(stringArrLiftE, payerMax)([]),
  }

  const f = foldValidatorS(myValidS)
}
