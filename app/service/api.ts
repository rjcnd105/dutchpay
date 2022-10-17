import type { DataFunctionArgs } from '@remix-run/node';
import type { FetcherWithComponents, FormMethod, SubmitOptions } from '@remix-run/react';
import { useMemo } from 'react';
import superjson from 'superjson';

export interface ApiFns {}

export type ApiFnKeys = keyof ApiFns;

export type ApiProps = {
  [key in ApiFnKeys]: Parameters<ApiFns[key]>[0];
};

export type Method<M extends FormMethod> = { method: M };

type ApiMethod = {
  [key in ApiFnKeys]: ApiFns[key]['method'];
};

export const useCallApi = <K extends ApiFnKeys>(action: K, method: ApiMethod[K]) =>
  useMemo(() => {
    const props = {
      method: method,
      action: `/api/${action}`,
    };
    return {
      props,
      submit<T>(
        fetcher: FetcherWithComponents<T>,
        data: ApiProps[K],
        opt?: SubmitOptions,
      ) {
        const formData = new FormData();
        formData.set('data', superjson.stringify(data));
        fetcher.submit(formData, { ...props, ...opt });
      },
    };
  }, [action]);

const isSuperjson = (data: any): data is { json: any } => data && data.json;
export function receiveApi<K extends ApiFnKeys>(action: K, formData: FormData) {
  const stringData = formData.get('data');
  console.log('receiveApi', action, stringData);
  if (typeof stringData !== 'string') {
    throw Error(`[API] ${action} - receive: data를 정상적으로 가져오지 못했습니다.`);
  }
  const data: ApiProps[K] = superjson.parse(stringData);
  console.log('api.ts', 'receiveApi', data);
  return data;
}

export const apiAction =
  <R, K extends ApiFnKeys>(API_NAME: K, fn: (p: ApiProps[K]) => R) =>
  async ({ request }: DataFunctionArgs) => {
    const formData = await request.formData();
    console.log('apiAction', 'formData', { ...formData });
    return fn(receiveApi(API_NAME, formData));
  };
