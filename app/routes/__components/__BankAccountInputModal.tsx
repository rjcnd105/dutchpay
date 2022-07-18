import type { Payer } from '@prisma/client';
import { useFetcher } from '@remix-run/react';

import Button from '~/components/ui/Button';
import Input from '~/components/ui/Input';
import type { MyDialogProps } from '~/components/ui/MyDialog';
import MyDialog from '~/components/ui/MyDialog';

type Props = Pick<MyDialogProps, 'open' | 'onClose' | 'children'> & {
  payer: Payer;
};

const __BankAccountInputModal = ({ payer, ...dialogProps }: Props) => {
  const fetcher = useFetcher();

  return (
    <MyDialog title={`'${payer.name}' 계좌`} {...dialogProps}>
      <fetcher.Form className="min-w-[328px] max-w-sm w-full bg-white" action="/api/inputBankAccount">
        <div>
          <Input id="bankAccount" name="bankAccount" placeholder="60530104068879 국민" hasUnderline></Input>
        </div>
        <div className="grid grid-cols-2 gap-16 mt-24">
          <Button theme="solid/white" onClick={() => dialogProps.onClose(false)}>
            취소
          </Button>
          <Button theme="solid/blue">저장할래</Button>
        </div>
        <input type="hidden" name="payerId" value={payer.id} />
      </fetcher.Form>
    </MyDialog>
  );
};
export default __BankAccountInputModal;
