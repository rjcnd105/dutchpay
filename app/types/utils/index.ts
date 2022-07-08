// object 값들의 타입을 추출
import type { ComponentType } from 'react';

export type Constructor<T = {}> = new (...args: any[]) => T;

export type AbstractConstructor<T = any, argT extends any[] = any[]> = abstract new (...args: [...argT]) => T;

// M 에 N 타입 덮어쓰기
export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type MapKey<T> = T extends Map<infer K, unknown> ? K : T extends undefined ? undefined : unknown;

export type MapValue<T> = T extends Map<unknown, infer V> ? V : T extends undefined ? undefined : unknown;

// |를 &로
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type CollectionIntersection<Arr extends any[]> = UnionToIntersection<Arr[number]>;

// string literal인 경우에 true
// type r1 = IdentifiableString<'aaa'> // true
// type r2 = IdentifiableString<string> // false
// type r3 = IdentifiableString<'a' | 'b'> // true
export type IdentifiableString<T> = T extends string ? (string extends T ? false : true) : false;

type C<A> = { [K in keyof A]: A[K] };

export type Optional<A, B extends keyof A> = C<Omit<A, B> & { [K in B]?: A[K] }>;

export type ExtractProps<T> = T extends ComponentType<infer P> ? P : T;
