import * as React from 'react';
import { useEffect } from 'react';
import clsx from 'clsx';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import SvgCheckboxCheck from '~/components/ui/Icon/CheckboxCheck';

type Props = Omit<RadixCheckbox.CheckboxProps, 'children'>;

const Checkbox = ({ className, ...props }: Props) => {
  return (
    <RadixCheckbox.Root className={clsx('ui_Checkbox', className)} {...props}>
      <div className="ui_Checkbox_check-wrap">
        <RadixCheckbox.Indicator className="ui_Checkbox_indicator">
          <SvgCheckboxCheck className="check-icon" stroke="white" />
        </RadixCheckbox.Indicator>
      </div>
    </RadixCheckbox.Root>
  );
};

export default Checkbox;

// clsx(
//   'w-20 h-20 rounded-[50%]',
//   api.isChecked
//     ? 'bg-primary400'
//     : api.isIndeterminate
//     ? 'bg-primary200'
//     : 'bg-grey100',
// );
