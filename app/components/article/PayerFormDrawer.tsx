import { useEffect, useRef } from 'react';

import Button from '~/components/ui/Button';
import Drawer from '~/components/ui/Drawer';
import SvgCross from '~/components/ui/Icon/Cross';
import type { Payer } from '@prisma/client';
import PayerForm from './PayerForm';
import { useSnapshot } from 'valtio';
import { proxySet } from 'valtio/utils';

export type PayerModifyDrawerProps = {
  previousPayerNames: string[];
  onSubmit: (
    previousPayerNames: Array<Payer['name']>,
    payerNames: Array<Payer['name']>,
  ) => void;
  isOpen: boolean;
  onClose: () => void;
};

const PayerFormDrawer = ({
  previousPayerNames,
  isOpen,
  onSubmit,
  onClose,
}: PayerModifyDrawerProps) => {
  const tempPayers = useSnapshot(proxySet<string>([]));
  const ref = useRef<HTMLInputElement>(null);

  function handleAdd(name: string) {
    tempPayers.add(name);
    ref.current?.focus();
  }

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => ref.current?.focus());
    else tempPayers.clear();
  }, [isOpen]);

  return (
    <Drawer open={isOpen} placement="bottom" onClose={onClose}>
      <div className="flex flex-col h-[90vh] w-[100vw] rounded-t-[24px] py-[18px] px-[20px] max-h-[476px]">
        <header className="drawer-head mb-8">
          <Button className="w-[28px] h-[28px] px-0" onClick={onClose}>
            <SvgCross width={28} height={28} />
          </Button>
        </header>
        <PayerForm
          payers={[...tempPayers]}
          onPayerAdd={handleAdd}
          onPayerRemove={tempPayers.delete}
          onSubmit={() => onSubmit(previousPayerNames, [...tempPayers])}
          inputRef={ref}
        />
      </div>
    </Drawer>
  );
};

export default PayerFormDrawer;
