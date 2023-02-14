import { toast } from 'react-toastify';

type Nil = undefined | null;
type NotNil<T> = T extends Nil ? never : T;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function isNil<T>(v: T): v is Nil {
  return v === undefined || v === null;
}
