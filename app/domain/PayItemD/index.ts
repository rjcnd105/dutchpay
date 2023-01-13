import type { PayItem } from '@prisma/client';
import { flow, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as ReadonlyArray from 'fp-ts/ReadonlyArray';
import { isNil } from '~/utils/common';
import { stringLiftE } from '~/utils/lift';
import {
  errorInfo,
  singleErrorValidator,
  transform,
} from '~/utils/validations';
import { COMMON_ERROR_TYPE } from '~/constants/commonErrorType';

export namespace PayItemD {
  const nameLengthMax = singleErrorValidator(
    (name: PayItem['name']) => name.length <= 8,
    {
      type: COMMON_ERROR_TYPE.최대글자수초과,
      message: '항목은 8자까지 입력 가능해',
    },
  );
  const nameLengthMin = singleErrorValidator(
    (name: PayItem['name']) => name.length !== 0,
    {
      type: COMMON_ERROR_TYPE.최소글자수미달,
      message: '항목의 이름을 입력해줘',
    },
  );
  const amountTransform = transform((amount: string) => {
    const numberAmount = Number.parseInt(amount.replaceAll(',', ''));
    return Number.isSafeInteger(numberAmount)
      ? numberAmount
      : errorInfo({
          type: COMMON_ERROR_TYPE.올바른형식아님,
          message: '금액이 올바른 형식이 아니야',
        });
  });
  const amountMax = singleErrorValidator(
    (amount: PayItem['amount']) => amount <= 10000000000,
    {
      type: COMMON_ERROR_TYPE.최대금액초과,
      message: '금액이 너무 커',
    },
  );
  const amountMin = singleErrorValidator(
    (amount: PayItem['amount']) => amount >= 0,
    {
      type: COMMON_ERROR_TYPE.최소금액미달,
      message: '금액이 -가 될 수는 없어',
    },
  );
  const amountUnknown = singleErrorValidator(
    (amount: PayItem['amount']) => Number.isSafeInteger(amount),
    {
      type: COMMON_ERROR_TYPE.올바른형식아님,
      message: '금액이 올바른 형식이 아니야',
    },
  );

  export const validator = {
    name: flow(stringLiftE, nameLengthMin, nameLengthMax),
    amount: flow(
      stringLiftE,
      amountTransform,
      amountMin,
      amountMax,
      amountUnknown,
    ),
  } as const;

  export const utils = {
    /*
     * @example
     * payStrSeparator("택시/16,000")
     * // -> Right<{ name: "택시", amount: 16000 }> | Left<{type: ..., message: ...}>
     * */
    payStrSeparator(str: string) {
      const [name, amount] = str.split('/');
      const result = pipe(
        E.Do,
        E.apS('name', validator.name(name)),
        E.apS('amount', validator.amount(amount)),
      );
      return result;
    },
    /*
     * @example
     * payStrSeparators(["택시/16,000", "고기/57,4000"])
     * // -> Right<[{ name: "택시", amount: 16000 }, { name: "고기", amount: 57400 }]> | Left<{type: ..., message: ...}>
     * */
    payStrSeparators(strArr: string[]) {
      const separate = ReadonlyArray.separate(
        strArr.map(utils.payStrSeparator),
      );
      return separate.left.length > 0
        ? E.left(separate.left[0])
        : E.right(separate.right);
    },
    makePayStrSeparators(payItem?: Pick<PayItem, 'name' | 'amount'> | null) {
      return isNil(payItem) ? '' : `${payItem.name}/${payItem.amount}`;
    },
  };
}
