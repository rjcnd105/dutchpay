import type { Payer } from '@prisma/client';
import clsx from 'clsx';

import Button from '~/components/ui/Button';
import SvgPlus from '~/components/ui/Icon/Plus';

export type PayerSelectNavigationProps = {
  onNewPayer: () => void;
  payers: Payer[];
  setSelectedPayerId: (payer: Payer['id']) => void;
  selectedPayerId: Payer['id'];
};
const __PayerSelectNavigation = ({
  onNewPayer,
  payers,
  setSelectedPayerId,
  selectedPayerId,
}: PayerSelectNavigationProps) => {
  return (
    <nav className="min-h-56 overflow-x-scroll">
      <div className="flex gap-x-8 nav-contents pl-20">
        <Button theme="ghost/lightblue" className="w-48" onClick={onNewPayer}>
          <SvgPlus className="stroke-primary300" />
        </Button>
        {payers.map(payer => {
          const isSelected = payer.id === selectedPayerId;
          return (
            <Button
              key={payer.id}
              theme={isSelected ? 'chip/blue' : 'chip/lightgrey'}
              className={clsx(isSelected && 'font-semibold', 'px-8')}
              onClick={() => setSelectedPayerId(payer.id)}
              hasClose={false}>
              {payer.name}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
export default __PayerSelectNavigation;
