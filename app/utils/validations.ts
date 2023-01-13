import { sequenceS } from 'fp-ts/Apply';
import type { Either } from 'fp-ts/Either';
import * as E from 'fp-ts/Either';
import { flow } from 'fp-ts/function';
import * as NonEmptyArray from 'fp-ts/NonEmptyArray';
import type { Predicate } from 'fp-ts/Predicate';

export type Message = string;

const errorURI = 'validation_error' as const;

export type ValidationErrorInfo = {
  readonly URI: typeof errorURI;
  readonly type: string;
  readonly message?: string;
};
export type ValidationErrorInput = Pick<
  ValidationErrorInfo,
  'type' | 'message'
>;

export const errorInfo = (info: ValidationErrorInput) =>
  Object.assign(
    {
      URI: errorURI,
    },
    info,
  );

export type ValidationError<A = unknown> = ValidationErrorInfo & {
  value: A;
};

export type ValidationErrors<A = unknown> = NonEmptyArray.NonEmptyArray<
  ValidationError<A>
>;

export type SingleValidation<A> = Either<ValidationError<A>, A>;
export type Validations<A> = Either<ValidationErrors<unknown>, A>;
export type ValidationGenerator<A> = (a: A) => Validations<A>;
export type ValidatorS<K extends string> = {
  [key in K]: <A>(a: A) => Validations<A>;
};

type BindedError = ReturnType<typeof toValidationError>;

export const validationError = (e: ValidationErrorInfo) => e;
export const isValidationError = (e: unknown): e is ValidationError =>
  typeof e === 'object' && e !== null && 'URI' in e && e.URI === errorURI;
export const validationErrors = <E>(
  e: ValidationError<E>,
): ValidationErrors<E> => [e];
export const toValidationError =
  (e: ValidationErrorInfo) =>
  <T>(value: T): ValidationError =>
    Object.assign({ value }, e);

const toValidationErrors = flow(toValidationError, e =>
  flow(e, validationErrors),
);
// const toValidationErrors2 = flow2(toValidationError, errors);

/*
 * 각 identifier당 하나의 에러를 검출할 때 일반적인 UI에 쉽게 사용하기 위한 것
 * @example
 * const nameLengthMax = singleErrorValidator((name: RoomModel['name']) => name.length <= 6, '이름은 6자까지 입력 가능해')
 * const nameLengthMin = singleErrorValidator((name: RoomModel['name']) => name.length !== 0, '이름을 입력해줘')
 * const nameValidator = flow(nameLengthMin, nameLengthMax)
 *  */

export const transform = <A, B>(fn: (a: A) => B | ValidationErrorInfo) =>
  E.chain((a: A) => {
    const result = fn(a);
    if (isValidationError(result)) {
      return E.left(toValidationError(result)(a));
    }
    return E.right(result as Exclude<B, ValidationErrorInfo>);
  });

export const singleErrorValidator = <A>(
  pred: Predicate<A>,
  error: ValidationErrorInput,
) =>
  E.chain<ValidationError<unknown>, A, A>(
    E.fromPredicate(pred, toValidationError(errorInfo(error))),
  );

/*
 * 모든 에러 검출시 사용
 */

export const validator = <A>(pred: Predicate<A>, error: ValidationErrorInput) =>
  flow(
    (eitherValue: Either<ValidationErrors<unknown>, A>) => eitherValue,
    v =>
      E.mapLeft((e: ValidationErrors<unknown>) => {
        const last = NonEmptyArray.last(e);
        return pred(last.value as A)
          ? e
          : NonEmptyArray.concat(
              toValidationErrors(errorInfo(error))(last.value),
            )(e);
      })(v),
    E.chain<ValidationErrors<unknown>, A, A>(
      E.fromPredicate(pred, toValidationErrors(errorInfo(error))),
    ),
  );

/*
 * struct 형태에 대한 검증
 * @example
 * const validatorStruct = {
 *   name: nameValidator("abcd"),
 *   age: ageValidator(12)
 * }
 * const validation = foldValidatorS(validatorStruct)
 * // -> Right<{ name: string, age: number }> | Left<ValidationErrors>
 * */
export const foldValidatorS = sequenceS(E.Apply);
