import * as E from '@fp-ts/core/Either';
import * as O from '@fp-ts/core/Option';
import { compose, flip, flow, pipe } from '@fp-ts/core/Function';

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

export const filterNilO = <A>(o: O.Option<A>): O.Option<NonNullable<A>> =>
  pipe(
    o,
    O.filter((a): a is NonNullable<A> => a !== null && a !== undefined),
  );
