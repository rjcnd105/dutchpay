import type { Room as RoomModel } from '@prisma/client';
import { flow } from 'fp-ts/function';

import { stringLiftE } from '~/utils/lift';
import { singleErrorValidator } from '~/utils/validations';
import { COMMON_ERROR_TYPE } from '~/constants/commonErrorType';

export namespace PayerD {
  const nameLengthMax = singleErrorValidator(
    (name: RoomModel['name']) => name.length <= 6,
    {
      type: COMMON_ERROR_TYPE.최대글자수초과,
      message: '6자까지 입력 가능해',
    },
  );
  const nameLengthMin = singleErrorValidator(
    (name: RoomModel['name']) => name.length !== 0,
    {
      type: COMMON_ERROR_TYPE.최소글자수미달,
      message: '이름을 입력해줘',
    },
  );

  export const validator = {
    name: flow(stringLiftE, nameLengthMax, nameLengthMin),
  } as const;
}
