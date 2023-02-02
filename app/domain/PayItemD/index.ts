import type { PayItem } from '@prisma/client';
import * as E from '@fp-ts/core/Either';
import * as PR from '@fp-ts/schema/ParseResult';
import * as S from '@fp-ts/schema';
import * as Semi from '@fp-ts/core/typeclass/Semigroup';
import * as ReadonlyArray from '@fp-ts/core/ReadonlyArray';
import { isNil } from '~/utils/common';
import { COMMON_ERROR_TYPE } from '~/constants/commonErrorType';
import { pipe } from '@fp-ts/core/Function';
import numberUtils from '~/utils/numberUtils';

export namespace PayItemD {
  const amountTransformDecode = (str: string): number => {
    return Number.parseInt(str.replaceAll(',', ''));
  };
  const amountTransformEncode = numberUtils.thousandsSeparators;
  const separator = '/' as const;

  export const nameSchema = pipe(
    S.string,
    S.minLength(0, {
      identifier: COMMON_ERROR_TYPE.최소글자수미달,
      message: () => '항목의 이름을 입력해줘',
    }),
    S.maxLength(8, {
      identifier: COMMON_ERROR_TYPE.최대글자수초과,
      message: () => '항목은 8자까지 입력 가능해',
    }),
  );

  export const amountSchema = pipe(
    S.string,
    S.transform(S.number, amountTransformDecode, amountTransformEncode),
    S.filter(n => Number.isSafeInteger(n), {
      identifier: COMMON_ERROR_TYPE.올바른형식아님,
      message: () => '금액이 올바른 형식이 아니야',
    }),
    S.greaterThan(0, {
      identifier: COMMON_ERROR_TYPE.최소금액미달,
      message: () => '금액이 -가 될 수는 없어',
    }),
    S.lessThan(10000000000, {
      identifier: COMMON_ERROR_TYPE.최대금액초과,
      message: () => '금액은 10억원 이하로 입력해줘',
    }),
  );

  export const nameDecode = S.decode(nameSchema);
  export const amountDecode = S.decode(amountSchema);

  export const schema = S.struct({
    id: S.number,
    roomId: S.string,
    name: nameSchema,
    amount: amountSchema,
  });

  export type Schema = S.Infer<typeof schema>;

  export const nameAmountDecoder = S.decode(
    pipe(schema, S.pick('name', 'amount')),
  );

  export const utils = {
    /*
     * @example
     * payStrSeparator("택시/16,000")
     * // -> Right<{ name: "택시", amount: 16000 }> | Left<{type: ..., message: ...}>
     * */
    payStrSeparator(str: string) {
      const [name, amount] = str.split(separator);
      return nameAmountDecoder({ name, amount });
    },
    /*
     * @example
     * payStrSeparators(["택시/16,000", "고기/57,4000"])
     * // -> ParseResult<[{ name: "택시", amount: 16000 }, { name: "고기", amount: 57400 }]> | ParseResult<never>
     * */
    payStrSeparators(strArr: string[]) {
      const [lefts, rights] = ReadonlyArray.separate(
        strArr.map(utils.payStrSeparator),
      );

      return ReadonlyArray.isNonEmpty(lefts)
        ? PR.failure(lefts[0][0])
        : PR.success(rights);
    },
    makePayStrSeparators({ name, amount }: Pick<PayItem, 'name' | 'amount'>) {
      return `${name}${separator}${amount}`;
    },
  };
}
