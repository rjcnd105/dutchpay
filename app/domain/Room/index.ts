import type { Room as RoomModel } from '@prisma/client'
import { sequenceS } from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as RE from 'fp-ts/lib/ReaderEither'
import * as t from 'io-ts'

import { liftE, singleErrorValidator, validatorS } from "~/utils/validation";

const a = t.type({ name: t.string })

const nameLengthMax = singleErrorValidator((name: RoomModel['name']) => name.length <= 6, '이름은 6자까지 입력 가능해')
const nameLengthMin = singleErrorValidator((name: RoomModel['name']) => name.length !== 0, '이름을 입력해줘')
const nameBiggerThen10 = singleErrorValidator((age: number) => age > 10, '10살 보단 많아야지')

export namespace Room {
  export const validator = {
    name: flow(liftE<string>, nameLengthMax,  nameLengthMin),
    age: flow(liftE<number>, nameBiggerThen10),
  }
}


const d = {
  name: Room.validator.name("10글자에요"),
  age: Room.validator.age(12)
}

const f = validatorS(d) /*?*/