import { ap, sequenceS } from 'fp-ts/Apply';
import type { Either } from 'fp-ts/Either';
import { chain } from 'fp-ts/Either';
import * as E from 'fp-ts/Either';
import Endo from 'fp-ts/Endomorphism';
import { flow, pipe } from 'fp-ts/function';
import M from 'fp-ts/Monoid';
import type { NonEmptyArray } from 'fp-ts/NonEmptyArray';
import { concat } from 'fp-ts/NonEmptyArray';
import type { Predicate } from 'fp-ts/Predicate';
import type { Reader } from 'fp-ts/Reader';
import * as RE from 'fp-ts/ReaderEither';
import * as ReadonlyArr from 'fp-ts/ReadonlyArray';
import { matchE } from 'fp-ts/ReaderEither';

export type Message = string;

export type Error = {
  readonly type: string;
  readonly message?: string;
};

export type ValidationErrors = {
  readonly value: unknown;
  readonly errors: NonEmptyArray<Error>;
};

export type Validation<A> = Either<ValidationErrors, A>;
export type SingleValidation<A> = Either<Error, A>;
export type Validator<A> = (a: A) => Validation<A>;
export type ValidatorS<K extends string> = {
  [key in K]: <A>(a: A) => Validation<A>;
};
// 추후 zod 기반으로 교체
/*
 * 모든 에러 검출시 사용
 */
export const validator = <A>(pred: Predicate<A>, error: Error) =>
  E.match<ValidationErrors, A, Validation<A>>(
    left =>
      E.left(
        pred(left.value as A)
          ? left
          : { value: left.value, errors: concat(left.errors)([error]) },
      ),
    value => (pred(value) ? E.right(value) : E.left({ value, errors: [error] })) /*?*/,
  );

/*
 * 각 identifier당 하나의 에러를 검출할 때 일반적인 UI에 쉽게 사용하기 위한 것
 * @example
 * const nameLengthMax = singleErrorValidator((name: RoomModel['name']) => name.length <= 6, '이름은 6자까지 입력 가능해')
 * const nameLengthMin = singleErrorValidator((name: RoomModel['name']) => name.length !== 0, '이름을 입력해줘')
 * const nameValidator = flow(nameLengthMin, nameLengthMax)
 *  */
export const singleErrorValidator = <A>(pred: Predicate<A>, error: Error) =>
  E.chain<Error, A, A>(value => (pred(value) ? E.right(value) : E.left(error)));

/*
 * struct 형태에 대한 검증
 * @example
 * const validatorStruct = {
 *   name: nameValidator(E.of("abcd")),
 *   age: ageValidator(E.of(12))
 * }
 * const validation = foldValidatorS(validatorStruct)
 * // -> Right<{ name: string, age: number }> | Left<ValidationErrors>
 * */
export const foldValidatorS = sequenceS(E.Apply);
