import * as React from 'react';
import { useEffect } from 'react';
import clsx from 'clsx';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import SvgCheckboxCheck from '~/components/ui/Icon/CheckboxCheck';

type Props = RadixCheckbox.CheckboxProps;

const Checkbox = ({ className }: Props) => {
  return (
    <RadixCheckbox.Root className={clsx('ui_Checkbox', className)}>
      <RadixCheckbox.Indicator className="CheckboxIndicator">
        <SvgCheckboxCheck className="check-icon" stroke="white" />
      </RadixCheckbox.Indicator>
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
