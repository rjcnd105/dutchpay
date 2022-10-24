import type { Payer, PayItem, Room } from '@prisma/client';
import { Link, useActionData, useFetcher, useOutletContext } from '@remix-run/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { flow } from 'fp-ts/function';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AnimatedNumber from '~/components/ui/AnimatedNumber';
import Button from '~/components/ui/Button';
import SvgCross from '~/components/ui/Icon/Cross';
import SvgPlusSquare from '~/components/ui/Icon/PlusSquare';
import { PayItemD } from '~/domain/PayItemD';
import type { Message } from '~/model/Message';
import { isSuccessMessage } from '~/model/Message';
import __BankAccountInputModal from '~/routes/__components/__BankAccountInputModal';
import type { PayerModifyDrawerProps } from '~/routes/__components/__PayerFormDrawer';
import PayerFormDrawer from '~/routes/__components/__PayerFormDrawer';
import __PayerSelectNavigation from '~/routes/__components/__PayerSelectNavigation';
import PayItemSeparatorInput from '~/routes/__components/__PayItemSeparatorInput';
import RoomHeader from '~/routes/__components/__RoomHeader';
import type { AllRoomData, OutletContextData } from '~/routes/$roomId';
import type { ApiProps } from '~/service/api';
import { useCallApi } from '~/service/api';
import numberUtils from '~/utils/numberUtils';
import pathGenerator from '~/service/pathGenerator';

export async function loader() {
  console.log('additem loader', '');
  return null;
}

type PayItemFormReducer =
  | {
      type: 'SET' | 'REMOVE';
      value: PayItem;
    }
  | {
      type: 'ADD';
      value: Omit<PayItem, 'id'>;
    }
  | {
      type: 'EMPTY_ADDS';
      value: Pick<PayItem, 'payerId' | 'roomId'>;
      length: number;
    };

export default function AddItem() {
  const fetcher = useFetcher();

  const room = useOutletContext<OutletContextData>();
  if (!room) return null;

  const actionData = useActionData<Message>();
  const addPayItemInputRef = useRef<HTMLInputElement>(null);
  const addPayItemScrollRef = useRef<HTMLDivElement>(null);
  const editedPayItemInputRef = useRef<HTMLInputElement>(null);

  const [isBankAccountOpen, setIsBankAccountOpen] = useState(false);

  const [isModifyPayerMode, setIsModifyPayerMode] = useState(false);

  const [selectedPayerId, _setSelectedPayerId] = useState(room.payers[0].id);
  const [editedPayItem, _setEditedPayItem] = useState<PayItem | null>(null);
  const [editedPayItemInputValue, setEditedPayItemInputValue] = useState('');
  const [payItemInputValue, setPayItemInputValue] = useState('');

  const callPayItemCreateApi = useCallApi('payItem/create', 'post');
  const callPayItemDeleteApi = useCallApi('payItem/delete', 'delete');
  const callPayItemUpdateApi = useCallApi('payItem/update', 'patch');
  const callPayerPutApi = useCallApi('payer/put', 'put');

  const setSelectedPayerId = flow(_setSelectedPayerId, () => _setEditedPayItem(null));

  // edit PayItem 선택
  const setEditedPayItem = useCallback((editPayItem: typeof editedPayItem) => {
    _setEditedPayItem(editPayItem);
    setEditedPayItemInputValue(PayItemD.utils.makePayStrSeparators(editPayItem));
  }, []);

  // 선택된 Payer의 데이터
  const selectedPayerData = useMemo(
    () => room.payers.find(payer => payer.id === selectedPayerId),
    [selectedPayerId, room.payers],
  );

  // 아이템들의 총액
  const payerTotalMount = useMemo(
    () => selectedPayerData?.payItems.reduce((pv, cv) => pv + cv.amount, 0) ?? 0,
    [selectedPayerData],
  );

  // 마지막 업데이트
  const lastUpdateDateStr = useMemo(
    () =>
      selectedPayerData?.paymentItemLastUpdatedDate &&
      format(new Date(selectedPayerData?.paymentItemLastUpdatedDate), 'yy.MM.dd HH:mm'),
    [selectedPayerData?.paymentItemLastUpdatedDate],
  );

  // Payer 저장
  const handlePayerSubmit: PayerModifyDrawerProps['onSubmit'] = (
    previousPayerNames,
    payerNames,
  ) => {
    if (!selectedPayerId) throw Error('payerId가 없습니다.');
    callPayerPutApi.submit(fetcher, { roomId: room.id, payerNames: payerNames });
    setIsModifyPayerMode(false);
  };

  // PayerId가 없을시 세팅해줌.
  // useEffect(() => {
  //   if (!selectedPayerId) setSelectedPayerId(room.payers[0].id);
  // }, []);

  // 기존에 selected 되어있던 payer을 삭제한 경우 다시 새로운 payers[0]을 selected
  useEffect(() => {
    if (!actionData || !room) return;
    switch (actionData.kind) {
      case 'putPayers': {
        if (
          isSuccessMessage(actionData) &&
          !room.payers.some(payer => payer.id === selectedPayerId)
        ) {
          setSelectedPayerId(room.payers[0].id);
        }
      }
    }
  }, [room]);

  function handlePayItemCreate(data: ApiProps['payItem/create']) {
    callPayItemCreateApi.submit(fetcher, data);
    setPayItemInputValue('');
    setTimeout(() => {
      addPayItemScrollRef.current?.scrollTo({
        top: addPayItemScrollRef.current.clientHeight,
        behavior: 'smooth',
      });
    }, 200);
  }

  const handlePayItemDelete = useCallback(
    (data: ApiProps['payItem/delete']) => {
      callPayItemDeleteApi.submit(fetcher, data);
      if (editedPayItem && editedPayItem.id === data.payItemId) _setEditedPayItem(null);
    },
    [editedPayItem],
  );

  function handlePayItemUpdate(data: ApiProps['payItem/update']) {
    callPayItemUpdateApi.submit(fetcher, data);
  }

  const onNewPayer = useCallback(() => setIsModifyPayerMode(true), []);

  return (
    <>
      <RoomHeader
        roomName={room.name}
        roomId={room.id}
        Right={<GoCalculatePageButton roomId={room.id} />}
      />
      <__PayerSelectNavigation
        onNewPayer={onNewPayer}
        payers={room.payers}
        selectedPayerId={selectedPayerId}
        setSelectedPayerId={setSelectedPayerId}
      />
      <div className="relative flex flex-col flex-auto overflow-hidden">
        <div className="flex flex-auto flex-col justify-between bg-lightgrey100 overflow-y-hidden">
          <div
            className="w-full px-16 py-12 overflow-y-scroll"
            key={selectedPayerId}
            ref={addPayItemScrollRef}>
            <div>
              <div className="flex mb-16 px-8">
                <div>
                  <strong className="font-bold text-heading text-darkgrey300">
                    <AnimatedNumber value={payerTotalMount} comma />
                    <span className="ml-4">원</span>
                  </strong>

                  <Button
                    className="text-caption1 pr-8"
                    size="sm"
                    onClick={() => setIsBankAccountOpen(true)}>
                    {selectedPayerData &&
                    selectedPayerData.bankAccountNumber.length > 0 ? (
                      <span className="text-grey300 ml-[2px]">
                        {selectedPayerData.bankAccountNumber}
                      </span>
                    ) : (
                      <>
                        <SvgPlusSquare className="stroke-grey300" />
                        <span className="text-grey300 ml-[2px]">계좌 추가</span>
                      </>
                    )}
                  </Button>
                </div>
                <span className="ml-auto mt-auto text-right text-caption3 font-light">
                  마지막 업데이트
                  <br />
                  {lastUpdateDateStr}
                </span>
              </div>
              <hr className="border-1 border-darkgrey300" />

              <div className="px-8 pt-8">
                {selectedPayerData?.payItems.map(payItem => (
                  <PayListItem
                    key={payItem.id}
                    isEditedItem={payItem.id === editedPayItem?.id}
                    setEditedPayItem={setEditedPayItem}
                    handlePayItemDelete={handlePayItemDelete}
                    payItem={payItem}
                    payerId={selectedPayerId}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="relative min-h-[112px]">
            {editedPayItem ? (
              <div className="absolute inset-0">
                <PayItemSeparatorInput
                  buttonText="수정"
                  onItemSubmit={payItem =>
                    handlePayItemUpdate({
                      payItem: { id: editedPayItem.id, ...payItem },
                      payerId: selectedPayerId,
                    })
                  }
                  value={editedPayItemInputValue}
                  onChange={e => setEditedPayItemInputValue(e.target.value)}
                  ref={editedPayItemInputRef}
                />
              </div>
            ) : (
              <div className="absolute inset-0">
                <PayItemSeparatorInput
                  buttonText="추가"
                  onItemSubmit={payItem =>
                    handlePayItemCreate({
                      payItem,
                      payerId: selectedPayerId,
                      roomId: room.id,
                    })
                  }
                  value={payItemInputValue}
                  onChange={e => {
                    setPayItemInputValue(e.target.value);
                  }}
                  ref={addPayItemInputRef}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedPayerData && (
        <__BankAccountInputModal
          open={isBankAccountOpen}
          onClose={() => setIsBankAccountOpen(false)}
          payer={selectedPayerData}
          onSubmit={() => setIsBankAccountOpen(false)}
        />
      )}
      <PayerFormDrawer
        isOpen={isModifyPayerMode}
        onClose={() => setIsModifyPayerMode(false)}
        previousPayerNames={room.payers.map(({ name }) => name)}
        onSubmit={handlePayerSubmit}
      />
    </>
  );
}

const GoCalculatePageButton = ({ roomId }: { roomId: Room['id'] }) => (
  <Link
    to={pathGenerator.room.calculate({ roomId })}
    className="flex justify-center items-center w-56 h-44 text-primary400 underline underline-offset-[2px]">
    정산하기
  </Link>
);

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
