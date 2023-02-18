import type { PayItem } from '@prisma/client';
import clsx from 'clsx';
import * as E from '@fp-ts/core/Either';
import type { ComponentPropsWithRef } from 'react';
import { forwardRef, useEffect, useMemo } from 'react';

import ButtonInput from '~/components/ui/ButtonInput';
import { PayItemD } from '~/domain/PayItemD';
import useError from '~/hooks/useError';
import type { PartRequired } from '~/types/utils';
import domUtils from '~/utils/domUtils';
import { isSome } from '@fp-ts/core/Option';

type Props = {
  buttonText: React.ReactNode;
  onItemSubmit(p: Pick<PayItem, 'name' | 'amount'>): void;
} & PartRequired<ComponentPropsWithRef<'input'>, 'value' | 'onChange'>;

const Index = forwardRef<HTMLInputElement, Props>(
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
        payItemError.show();
      }
    }

    const handleEnter = domUtils.onEnter(handleButtonClick);

    useEffect(() => payItemError.hide, [payItemError.hide, strValue]);

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
            {payItemError.isViewErr && '위 가이드와 같은 형식으로 입력 부탁해!'}
          </span>
          <span className="ml-auto">
            <span
              className={clsx(
                payItemError.isViewErr ? 'text-warning' : 'text-darkgrey100',
              )}>
              {isSome(payItemError.viewErr)
                ? payItemError.viewErr.value.message
                : 0}
            </span>
            /8
          </span>
        </p>
      </div>
    );
  },
);
export default Index;
