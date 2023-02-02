import type { Room as RoomModel } from '@prisma/client';

import { stringLiftE } from '~/utils/lift';
import { singleErrorValidator } from '~/utils/validations';
import * as S from '@fp-ts/schema';
import { COMMON_ERROR_TYPE } from '~/constants/commonErrorType';
import { pipe } from '@fp-ts/core/Function';

export namespace PayerD {
  export const nameSchema = pipe(
    S.string,
    S.maxLength(6, {
      identifier: COMMON_ERROR_TYPE.최대글자수초과,
      message: () => '6자까지 입력 가능해',
    }),
    S.minLength(0, {
      identifier: COMMON_ERROR_TYPE.최소글자수미달,
      message: () => '이름을 입력해줘',
    }),
  );

  export const nameDecode = S.decode(nameSchema);
}
