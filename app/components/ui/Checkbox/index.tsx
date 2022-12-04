import { normalizeProps, useMachine } from '@zag-js/react';
import * as checkbox from '@zag-js/checkbox';
import * as React from 'react';
import { useEffect } from 'react';
import clsx from 'clsx';
import SvgCheckboxCheck from '~/components/ui/Icon/CheckboxCheck';

type Props = checkbox.Context & {
  className?: string;
  checked?: boolean;
  children?: React.ReactNode;
};
const Checkbox = ({ className, children, ...props }: Props) => {
  const [state, send] = useMachine(checkbox.machine(props));
  const api = checkbox.connect(state, send, normalizeProps);

  useEffect(() => {
    if (props.checked) api.setChecked(props.checked);
  }, [props.checked]);

  return (
    <label className={clsx('ui_Checkbox', className)} {...api.rootProps} >
      <span
        className={clsx(
          'w-20 h-20 rounded-[50%]',
          api.isChecked ? 'bg-primary400' :
            (api.isIndeterminate ? 'bg-primary200' : 'bg-grey100'),
        )}
        {...api.labelProps}>
        {api.isChecked && <SvgCheckboxCheck stroke='white' />}
      </span>
      <div {...api.controlProps} />
      <input
        {...api.inputProps}
        onChange={props.checked === undefined ? api.inputProps.onChange : undefined}
      />
      {children}
    </label>
  );
};
export default Checkbox;
