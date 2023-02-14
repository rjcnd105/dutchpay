import type { ErrorData } from '~/module/schema/schemaError';

export const COMMON_ERROR_TYPE = {
  알수없는에러: '알수없는에러',
  최대글자수초과: '최대글자수초과',
  최소글자수미달: '최소글자수미달',
  최대금액초과: '최대금액초과',
  최소금액미달: '최소금액미달',
  올바른형식아님: '올바른형식아님',
} as const;

export const DEFAULT_ERROR: ErrorData<
  (typeof COMMON_ERROR_TYPE)['알수없는에러']
> = {
  code: COMMON_ERROR_TYPE.알수없는에러,
  message: '알 수 없는 에러가 발생했습니다.',
};
