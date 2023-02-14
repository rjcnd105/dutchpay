import * as E from '@fp-ts/core/Either';
import * as Str from '@fp-ts/core/String';

export const liftE = <A>(v: A) => E.of(v);
export const stringLiftE = (v: unknown) =>
  Str.isString(v) ? E.right(v) : E.left<unknown>(v);
export const numberLiftE = liftE<number>;
export const stringArrLiftE = liftE<string[]>;
