import type { PayItem } from '@prisma/client';
import clsx from 'clsx';
import * as E from 'fp-ts/Either';
import { isRight } from 'fp-ts/Either';
import type { ComponentPropsWithRef } from 'react';
import { useEffect, useMemo } from 'react';

import ButtonInput from '~/components/ui/ButtonInput';
import { PayItemD } from '~/domain/PayItemD';
import useError from '~/hooks/useError';
import type { PartRequired } from '~/types/utils';
import domUtils from '~/utils/domUtils';

type Props = {
  buttonText: React.ReactNode;
  onItemSubmit(p: Pick<PayItem, 'name' | 'amount'>): void;
} & PartRequired<ComponentPropsWithRef<'input'>, 'value' | 'onChange'>;

const PayItemSeparatorInput = ({ buttonText, onItemSubmit, value, ...props }: Props) => {
  const [strValue, payItemResult] = useMemo(() => {
    const _strValue = `${value}`;
    return [_strValue, PayItemD.utils.payStrSeparator(_strValue)];
  }, [value]);

  const payItemError = useError(payItemResult);

  function handleButtonClick() {
    if (isRight(payItemResult)) {
      onItemSubmit(payItemResult.right);
    } else {
      payItemError.showError();
    }
  }
  const handleEnter = domUtils.onEnter(handleButtonClick);

  useEffect(() => payItemError.hiddenError, [strValue]);

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
        {...props}
      />
      <p className="flex text-caption1 h-20 font-light">
        <span className="text-warning">
          {payItemError.viewError?.message && '위 가이드와 같은 형식으로 입력 부탁해!'}
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
};
export default PayItemSeparatorInput;
