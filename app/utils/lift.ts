import * as E from 'fp-ts/Either'

// validation을 하기 위해 value로부터 검증 가능한 Either 모나드로 끌어올림
export const liftE = <A>(v: A) => E.of(v)
/* prettier-ignore */
export const stringLiftE = liftE<string>;
/* prettier-ignore */
export const numberLiftE = liftE<number>;
/* prettier-ignore */
export const stringArrLiftE = liftE<string[]>;
