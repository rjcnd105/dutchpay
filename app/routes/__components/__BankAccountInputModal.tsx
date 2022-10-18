import type { Payer } from '@prisma/client';
import { useFetcher } from '@remix-run/react';
import { useRef } from 'react';

import Button from '~/components/ui/Button';
import Input from '~/components/ui/Input';
import type { MyDialogProps } from '~/components/ui/MyDialog';
import MyDialog from '~/components/ui/MyDialog';
import type { ApiProps } from '~/service/api';
import { useCallApi } from '~/service/api';

type Props = Pick<MyDialogProps, 'open' | 'onClose' | 'children'> & {
  payer: Payer;
  onSubmit?: () => void;
};

const __BankAccountInputModal = ({ payer, onSubmit, ...dialogProps }: Props) => {
  const fetcher = useFetcher();
  const bankAccountRef = useRef<HTMLInputElement>(null);

  const callPayUpdateBankAccount = useCallApi('payer/updateBankAccount', 'patch');

  return (
    <MyDialog title={`'${payer.name}' 계좌`} {...dialogProps}>
      <div className="min-w-[328px] max-w-sm w-full bg-white">
        <div>
          <Input
            name="bankAccountNumber"
            placeholder="60530104068879 국민"
            defaultValue={payer.bankAccountNumber}
            hasUnderline
            ref={bankAccountRef}
          />
        </div>
        <div className="grid grid-cols-2 gap-16 mt-24">
          <Button theme="solid/white" onClick={() => dialogProps.onClose(false)}>
            취소
          </Button>
          <Button
            onClick={() => {
              callPayUpdateBankAccount.submit(fetcher, {
                payer: {
                  id: payer.id,
                  bankAccountNumber: bankAccountRef.current?.value ?? '',
                },
              });
              onSubmit?.();
            }}
            theme="solid/blue">
            저장할래
          </Button>
        </div>
      </div>
    </MyDialog>
  );
};
export default __BankAccountInputModal;
