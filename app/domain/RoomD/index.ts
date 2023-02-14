import * as S from '@fp-ts/schema';

import { pipe } from '@fp-ts/core/Function';
import { COMMON_ERROR_TYPE } from '~/constants/commonErrorType';

export namespace RoomD {
  export const ERROR_TYPE = {
    payers: {
      최대인원초과: '최대인원초과',
      최소인원미달: '최소인원미달',
    },
  } as const;

  export const idSchema = S.string;

  export const nameSchema = pipe(
    S.string,
    S.maxLength(13, {
      message: () => '13자까지 입력 가능해',
    }),
    S.minLength(1, {
      message: () => '이름을 입력해줘',
    }),
  );
  export const nameDecode = S.decode(nameSchema);

  export const payerSchema = pipe(
    S.array(S.string),
    S.filter(v => v.length <= 10, {
      message: () => '10명까지만 가능해',
    }),
    S.filter(v => v.length > 0, {
      message: () => '최소 1명은 있어야 해',
    }),
  );
  export const payerDecode = S.decode(payerSchema);

  export const schema = S.struct({
    id: idSchema,
    name: nameSchema,
    payers: payerSchema,
  });
  export type Schema = S.Infer<typeof schema>;
  export const decode = S.decode(schema);
}
