import { useMachine, normalizeProps } from '@zag-js/react';
import * as checkbox from '@zag-js/checkbox';
import * as React from 'react';
import clsx from 'clsx';
import SvgCheckboxCheck from '~/components/ui/Icon/CheckboxCheck';
import { useEffect } from 'react';

type Props = checkbox.Context & {
  checked?: boolean;
};
const Checkbox = (props: Props) => {
  const [state, send] = useMachine(checkbox.machine(props));
  const api = checkbox.connect(state, send, normalizeProps);

  useEffect(() => {
    if (props.checked) api.setChecked(props.checked);
  }, [props.checked]);

  return (
    <label className="ui_Checkbox" {...api.rootProps}>
      <span
        className={clsx(
          'w-24 h-24 rounded-[50%]',
          api.isChecked || api.isIndeterminate ? 'bg-primary400' : 'bg-grey100',
        )}
        {...api.labelProps}>
        {api.isChecked && <SvgCheckboxCheck stroke="white" />}
      </span>
      <div {...api.controlProps} />
      <input
        {...api.inputProps}
        onChange={props.checked === undefined ? api.inputProps.onChange : undefined}
      />
    </label>
  );
};
export default Checkbox;
