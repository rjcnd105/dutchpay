import type { PayItem } from '@prisma/client'
import { flow, pipe } from 'fp-ts/function'
import * as E from 'fp-ts/lib/Either'

import result from '~/routes/$roomId/result'
import { numberLiftE, stringLiftE } from '~/utils/lift'
import { singleErrorValidator, SingleValidation } from '~/utils/validation'

export namespace PayItemD {
  export const ERROR_TYPE = {
    최대글자수초과: '최대글자수초과',
    최소글자수미달: '최소글자수미달',
    최대금액초과: '최대금액초과',
    최소금액미달: '최소금액미달',
    금액올바른형식아님: '금액올바른형식아님',
  } as const

  const nameLengthMax = singleErrorValidator((name: PayItem['name']) => name.length <= 8, {
    type: PayItemD.ERROR_TYPE.최대글자수초과,
    message: '항목은 8자까지 입력 가능해',
  })
  const nameLengthMin = singleErrorValidator((name: PayItem['name']) => name.length !== 0, {
    type: PayItemD.ERROR_TYPE.최소글자수미달,
    message: '항목의 이름을 입력해줘',
  })
  const amountMax = singleErrorValidator((amount: PayItem['amount']) => amount <= 10000000000, {
    type: PayItemD.ERROR_TYPE.최대금액초과,
    message: '금액이 너무 커',
  })
  const amountMin = singleErrorValidator((amount: PayItem['amount']) => amount >= 0, {
    type: PayItemD.ERROR_TYPE.최소금액미달,
    message: '금액이 -가 될 수는 없어',
  })
  const amountUnknown = singleErrorValidator((amount: PayItem['amount']) => Number.isSafeInteger(amount), {
    type: PayItemD.ERROR_TYPE.금액올바른형식아님,
    message: '금액이 올바른 형식이 아니야',
  })

  export const validator = {
    name: flow(stringLiftE, nameLengthMin, nameLengthMax),
    amount: flow(numberLiftE, amountMin, amountMax, amountUnknown),
  } as const

  export const utils = {
    paySeparator: (str: string) => {
      const [name, amount] = str.split(str)
      const result = pipe(
        E.Do,
        E.apS('name', validator.name(name)),
        E.apS('amount', validator.amount(Number.parseInt(amount))),
      )
      return result
    },
    paySeparators: (strArr: string[]) => {
      for (const str of strArr) {
        const payItemData = utils.paySeparator(result)
      }
    },
  }
}
