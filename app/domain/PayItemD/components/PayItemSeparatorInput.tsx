import type { PayItem } from '@prisma/client';
import clsx from 'clsx';
import * as E from '@fp-ts/core/Either';
import type { ComponentPropsWithRef } from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import ButtonInput from '~/components/ui/ButtonInput';
import { PayItemD } from '~/domain/PayItemD';
import useError from '~/hooks/useError';
import type { PartRequired } from '~/types/utils';
import domUtils from '~/utils/domUtils';
import { flow } from '@fp-ts/core/Function';

type Props = {
  buttonText: React.ReactNode;
  onItemSubmit(p: Pick<PayItem, 'name' | 'amount'>): void;
} & PartRequired<ComponentPropsWithRef<'input'>, 'value' | 'onChange'>;

const PayItemSeparatorInput = forwardRef<HTMLInputElement, Props>(
  ({ buttonText, onItemSubmit, value, ...props }, ref) => {
    const [strValue, payItemResult] = useMemo(() => {
      const _strValue = `${value}`;
      return [_strValue, PayItemD.utils.payStrSeparator(_strValue)];
    }, [value]);

    const payItemError = useError(payItemResult);

    function handleButtonClick() {
      if (E.isRight(payItemResult)) {
        onItemSubmit(payItemResult.right);
      } else {
        payItemError.showError();
      }
    }
    const handleEnter = domUtils.onEnter(handleButtonClick);

    useEffect(
      () => payItemError.hiddenError,
      [payItemError.hiddenError, strValue],
    );

    return (
      <div className="shadow-100 px-20 py-12 bg-white">
        <p className="text-caption1 h-20 text-darkgrey100 mb-4 font-light">
          입력 예) 택시/12,000
        </p>
        <ButtonInput
          button={{
            className: 'min-w-64',
            children: buttonText,
            onClick: handleButtonClick,
          }}
          onKeyDown={handleEnter}
          value={strValue}
          ref={ref}
          {...props}
        />
        <p className="flex text-caption1 h-20 font-light">
          <span className="text-warning">
            {payItemError.viewError?.message &&
              '위 가이드와 같은 형식으로 입력 부탁해!'}
          </span>
          <span className="ml-auto">
            <span
              className={clsx(
                payItemError.viewError ? 'text-warning' : 'text-darkgrey100',
              )}>
              {E.isRight(payItemResult) ? payItemResult.right.name.length : 0}
            </span>
            /8
          </span>
        </p>
      </div>
    );
  },
);
export default PayItemSeparatorInput;

const usePayItemSeparatorInput = () => {
  const [value, setValue] = useState('');
  const setItem = useCallback(
    flow(PayItemD.utils.makePayStrSeparators, setValue),
    [setValue],
  );
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const ref = useRef<HTMLInputElement>(null);
  const focus = useCallback(() => {
    ref.current?.focus();
  }, [ref]);

  return { setValue, setItem, props: { ref, focus, value, onChange } };
};
