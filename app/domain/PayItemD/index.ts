import type { PayItem } from '@prisma/client';
import * as PR from '@fp-ts/schema/ParseResult';
import * as S from '@fp-ts/schema';
import * as ReadonlyArray from '@fp-ts/core/ReadonlyArray';
import { pipe } from '@fp-ts/core/Function';
import numberUtils from '~/utils/numberUtils';
import { commonNameSchema } from '~/module/schema/datas';

export namespace PayItemD {
  const amountTransformDecode = (str: string): number => {
    return Number.parseInt(str.replaceAll(',', ''));
  };
  const amountTransformEncode = numberUtils.thousandsSeparators;
  const separator = '/' as const;

  export const nameSchema = commonNameSchema({ max: 8 });

  export const amountSchema = pipe(
    S.string,
    S.transform(S.number, amountTransformDecode, amountTransformEncode),
    S.filter(n => Number.isSafeInteger(n), {
      message: () => '금액이 올바른 형식이 아니야',
    }),
    S.greaterThan(0, {
      message: () => '금액이 -가 될 수는 없어',
    }),
    S.lessThan(10000000000, {
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
