import * as E from '@fp-ts/core/Either';
import * as O from '@fp-ts/core/Option';
import type * as PR from '@fp-ts/schema/ParseResult';
import { compose, flow, pipe } from '@fp-ts/core/Function';
import type { ErrorData } from '~/module/schema/schemaError';
import { resultWithDefaultError } from '~/module/schema/schemaError';
import type { ReactNode } from 'react';

export const alt =
  <E2>(e2: E2) =>
  <E, A>(e: E.Either<E, A>): E.Either<E2, A> =>
    E.isLeft(e) ? E.left(e2) : e;

// const applyF = flip(compose);
// compose를 flip시키면 generic타입이 깨져서 새로 만듦
export const composeR =
  <A, B>(ab: (a: A) => B) =>
  <C>(bc: (b: B) => C) =>
    flow(ab, bc);

export type GetRight<T> = T extends E.Either<unknown, infer A> ? A : never;
export type GetLeft<T> = T extends E.Either<infer E, unknown> ? E : never;

// null, undefined의 경우 O.none()을 반환
export const filterNilO = <A>(o: O.Option<A>): O.Option<NonNullable<A>> =>
  pipe(
    o,
    O.filter((a): a is NonNullable<A> => a !== null && a !== undefined),
  );

export const imap =
  <A, B>(f: (a: A) => B) =>
  (self: A): B =>
    f(self);

export const resultRender = flow(
  resultWithDefaultError,
  // 타입스크립트는 point free를 싫어해....ㅠㅠㅠ
  resultFn =>
    <A>(r: PR.ParseResult<A>) =>
    (
      onSuccess: (a: A) => ReactNode,
      onFailure: (e: ErrorData<string>) => ReactNode,
    ) =>
      pipe(resultFn(r), E.match(onFailure, onSuccess)),
);
