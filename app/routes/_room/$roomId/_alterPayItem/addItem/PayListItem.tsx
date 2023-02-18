import type { Payer, PayItem } from '@prisma/client';
import type { ApiProps } from '~/service/api';
import Button from '~/components/ui/Button';
import clsx from 'clsx';
import numberUtils from '~/utils/numberUtils';
import SvgCross from '~/components/ui/Icon/Cross';

type PayListItemProps = {
  payItem: PayItem;
  payerId: Payer['id'];
  isEditedItem: boolean;
  setEditedPayItem(payItem: PayItem | null): void;
  handlePayItemDelete(apiProps: ApiProps['payItem/delete']): void;
};
const PayListItem = ({
  payItem,
  payerId,
  isEditedItem,
  setEditedPayItem,
  handlePayItemDelete,
}: PayListItemProps) => (
  <div
    key={payItem.id}
    className="flex h-44 border-b-1 border-b-lightgrey200 text-darkgrey300">
    <Button
      className={clsx(
        'flex flex-auto text-body2 hover:font-semibold',
        isEditedItem && 'font-semibold text-primary400',
      )}
      size="sm"
      onClick={() => {
        setEditedPayItem(isEditedItem ? null : payItem);
      }}>
      <span>{payItem.name}</span>
      <span className="ml-auto underline underline-offset-1">
        {numberUtils.thousandsSeparators(payItem.amount)}
      </span>
    </Button>
    <Button
      className="min-w-32 stroke-darkgrey100 hover:stroke-darkgrey200"
      size="sm"
      onClick={() =>
        handlePayItemDelete({
          payItemId: payItem.id,
          payerId,
        })
      }>
      <SvgCross width={16} height={16}></SvgCross>
    </Button>
  </div>
);
export default PayListItem;
