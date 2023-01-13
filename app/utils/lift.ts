import * as E from 'fp-ts/Either';
import type { SingleValidation } from '~/utils/validations';

export const liftE = <A>(v: A) => E.of(v);
export const stringLiftE = liftE<string>;
export const numberLiftE = liftE<number>;
export const stringArrLiftE = liftE<string[]>;
