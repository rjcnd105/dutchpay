import type { HtmlMetaDescriptor } from '@remix-run/react';
import { useLoaderData as useRemixLoaderData } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { json as remixJson } from '@remix-run/node';
import { deserialize, serialize } from 'superjson';
import type { SuperJSONResult } from 'superjson/dist/types';

type JsonResponse = ReturnType<typeof remixJson>;
type MetaArgs = Parameters<MetaFunction>[0];
type MetaArgsSansData = Omit<MetaArgs, 'data'>;

type SuperJSONMetaFunction<Data> = {
  (args: MetaArgsSansData & { data: Data }): HtmlMetaDescriptor;
};

export const json = <Data>(
  obj: Data,
  init?: number | ResponseInit,
): JsonResponse => {
  const superJsonResult = serialize(obj);
  return remixJson(superJsonResult, init);
};

export const parse = <Data>(superJsonResult: SuperJSONResult) =>
  deserialize(superJsonResult) as Data;

export const withSuperJSON =
  <Data>(metaFn: MetaFunction): SuperJSONMetaFunction<Data> =>
  ({ data, ...rest }: MetaArgs): HtmlMetaDescriptor =>
    metaFn({ ...rest, data: parse<Data>(data) });

export const useLoaderData = <Data>() => {
  const loaderData = useRemixLoaderData<SuperJSONResult>();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return parse<Exclude<Data, RequestInit>>(loaderData);
};
