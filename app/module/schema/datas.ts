import { pipe } from '@fp-ts/core/Function';
import * as S from '@fp-ts/schema';
import {
  result2ErrorWithDefault,
  schemaError,
} from '~/module/schema/schemaError';
import { COMMON_ERROR_TYPE, DEFAULT_ERROR } from '~/constants/commonErrorType';

type Range = { max: number };

export const commonNameSchema = ({ max }: Range) =>
  pipe(
    S.string,
    S.trim,
    S.minLength(1),
    schemaError({
      code: COMMON_ERROR_TYPE.최소글자수미달,
      message: `글자를 입력해줘`,
    }),
    S.maxLength(max),
    schemaError({
      code: COMMON_ERROR_TYPE.최대글자수초과,
      message: `${max}자까지 입력 가능해`,
    }),
    S.filter(s => !/[\{\}\[\]\/?.,;:|\)*~`!^\+<>@\#$%&\\\=\(\'\"]/g.test(s)),
    schemaError({
      code: '특수문자불가',
      message: '-_외 특수문자를 사용할 수 없어',
    }),
  );

export const result2Error = result2ErrorWithDefault(DEFAULT_ERROR);
