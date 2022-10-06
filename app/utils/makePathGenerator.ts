import type { IdentifiableString } from '~/types/utils';
import type { ParamParseKey } from 'react-router';
import { generatePath } from 'react-router';

// ParamParseKey는 :로 시작하는 동적 라우트 키 값의 이름을 뽑아온다.
// ParamParseKey<"/:userName/aaa/:blogId/edit"> -> 'userName' | 'blogId'

export type RouterPathFn<T extends string> = (
  ...params: IdentifiableString<ParamParseKey<T>> extends true
    ? [
        {
          [key in ParamParseKey<T>]: string;
        },
      ]
    : []
) => string;

/*
 * @example
 * const roomRouteGenerator = makePathGenerator('/:userId/:roomId/new')
 * roomRouteGenerator({ userId: "minsu", roomId: "32" })
 * // -> /minsu/32/new
 *
 * const loginRouteGenerator = makePathGenerator('/login')
 * loginRouteGenerator()
 * // -> /login
 * */
export const makePathGenerator =
  <Path extends string>(patternPath: Path): RouterPathFn<Path> =>
  (...params) =>
    generatePath(patternPath, ...params);

export const additionSearchParams =
  <SearchParams extends Record<string, string>>(path: string) =>
  (searchParams?: SearchParams) =>
    searchParams
      ? [...Object.entries(searchParams)].reduce(
          (pv, cv, i) => `${pv}${i === 0 ? '?' : '&'}${cv.join('=')}`,
          path,
        )
      : path;
