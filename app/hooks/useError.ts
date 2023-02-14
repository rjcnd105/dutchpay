import { useMemo, useState } from 'react';
import type * as PR from '@fp-ts/schema/ParseResult';
import * as O from '@fp-ts/core/Option';
import type { ErrorData } from '~/module/schema/schemaError';
import { result2ErrorWithDefault } from '~/module/schema/schemaError';
import { DEFAULT_ERROR } from '~/constants/commonErrorType';
import { pipe } from '@fp-ts/core/Function';
import { lazyNull } from '~/constants/common';

const defaultOpt = {
  defaultHideError: true,
};

//  result2Error :: <A>(r: PR.ParseResult<A>) => O.Option<ErrorData<string>>
const result2Error = result2ErrorWithDefault(DEFAULT_ERROR);

const useError = <A>(value: PR.ParseResult<A>, opt?: typeof defaultOpt) => {
  const _opt = Object.assign({}, defaultOpt, opt);
  const [isHideError, setIsHideError] = useState<boolean>(
    _opt.defaultHideError,
  );
  const show = () => setIsHideError(false);
  const hide = () => setIsHideError(true);
  const err = useMemo(() => result2Error(value), [value]);
  const viewErr = isHideError ? O.none() : err;
  const isError = O.isSome(err);
  const isViewErr = O.isSome(viewErr);

  const renderViewErr = (render: (e: ErrorData<string>) => React.ReactNode) =>
    pipe(viewErr, O.match(lazyNull, render));

  return {
    value,
    err,
    isError,
    viewErr,
    isViewErr,
    renderViewErr,
    hide,
    show,
  };
};

export default useError;
