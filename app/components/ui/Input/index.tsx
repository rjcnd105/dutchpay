import clsx from 'clsx';
import type { InputNumberProps } from 'rc-input-number';
import InputNumber from 'rc-input-number';
import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

import { CrossCircle } from '~/components/ui/Icon';
import domUtils from '~/utils/domUtils';

interface CommonProps {
  hasClear?: boolean;
  hasUnderline?: boolean;
  wrapClassName?: ComponentPropsWithoutRef<'div'>['className'];
}
interface InputType extends ComponentPropsWithoutRef<'input'>, CommonProps {}
interface NumberInputType extends InputNumberProps, CommonProps {
  type: 'money';
}

type InputProps = InputType | NumberInputType;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasUnderline = false, hasClear = true, wrapClassName, className, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const onClear = useCallback(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        domUtils.inputChangeTrigger(inputRef.current, '');
      }
    }, []);

    return (
      <div className={clsx('ui_input', hasUnderline && 'border-b-1 border-b-grey200', wrapClassName)}>
        {props.type === 'money' ? (
          <InputNumber
            className={clsx('w-full', hasClear && 'pr-32', className)}
            formatter={value => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
            required
            ref={inputRef}
            step={100}
            max={10000000000}
            min={0}
            precision={0}
            {...(props as NumberInputType)}></InputNumber>
        ) : (
          <input
            className={clsx('w-full', hasClear && 'pr-32', className)}
            ref={inputRef}
            {...(props as InputType)}
            required
          />
        )}
        {hasClear && (
          <button
            type="button"
            className="absolute flex right-0 top-1/2 -translate-y-1/2 items-center justify-end w-32 h-32"
            onClick={onClear}>
            <CrossCircle className="fill-grey300" width={14} height={14} />
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
