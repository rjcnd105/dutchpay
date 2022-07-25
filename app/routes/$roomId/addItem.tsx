import type { Payer, PayItem } from '@prisma/client';
import { useActionData, useFetcher } from '@remix-run/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import * as E from 'fp-ts/lib/Either';
import { isRight } from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';
import { produce } from 'immer';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useOutletContext } from 'react-router';

import AnimatedNumber from '~/components/ui/AnimatedNumber';
import Button from '~/components/ui/Button';
import ButtonInput from '~/components/ui/ButtonInput';
import SvgCross from '~/components/ui/Icon/Cross';
import SvgPlusSquare from '~/components/ui/Icon/PlusSquare';
import { PayItemD } from '~/domain/PayItemD';
import useError from '~/hooks/useError';
import type { Message } from '~/model/Message';
import { isSuccessMessage } from '~/model/Message';
import __BankAccountInputModal from '~/routes/__components/__BankAccountInputModal';
import type { PayerModifyDrawerProps } from '~/routes/__components/__PayerFormDrawer';
import PayerFormDrawer from '~/routes/__components/__PayerFormDrawer';
import __PayerSelectNavigation from '~/routes/__components/__PayerSelectNavigation';
import RoomHeader from '~/routes/__components/__RoomHeader';
import type { AllRoomData, OutletContextData } from '~/routes/$roomId';
import { useCallApi } from '~/service/api';
import domUtils from '~/utils/domUtils';
import numberUtils from '~/utils/numberUtils';

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

type PayItemFormData = AllRoomData['payers'];

const payItemFormReducer = produce((draft: PayItemFormData, action: PayItemFormReducer) => {
  const findPayer = (payerId: Payer['id']) => {
    return draft.find(payer => payerId === payer.id);
  };

  switch (action.type) {
    case 'SET': {
      const payer = findPayer(action.value.payerId);
      if (!payer) break;

      const index = payer.payItems.findIndex(({ id }) => id === action.value.id);
      if (index !== -1) Object.assign(payer.payItems[index], action.value);
      break;
    }
    case 'REMOVE': {
      const payer = findPayer(action.value.payerId);
      if (!payer) break;

      const index = payer.payItems.findIndex(({ id }) => id === action.value.id);
      if (index !== -1) delete payer.payItems[index];
      break;
    }
    case 'ADD': {
      const payer = findPayer(action.value.payerId);
      if (!payer) break;

      payer.payItems.push({ id: -numberUtils.random(12), ...action.value });
      break;
    }
    case 'EMPTY_ADDS': {
      const payer = findPayer(action.value.payerId);
      if (!payer) break;

      for (let i = 0; i < action.length; i++) {
        payer.payItems.push({ id: -numberUtils.random(12), name: '', amount: 0, ...action.value });
      }
      break;
    }
  }
});

export default function addItem() {
  const fetcher = useFetcher();

  const room = useOutletContext<OutletContextData>();
  const actionData = useActionData<Message>();
  const addPayItemInputRef = useRef<HTMLInputElement>(null);
  const addPayItemScrollRef = useRef<HTMLDivElement>(null);

  const [isBankAccountOpen, setIsBankAccountOpen] = useState(false);

  const [isModifyPayerMode, setIsModifyPayerMode] = useState(false);

  const [selectedPayerId, _setSelectedPayerId] = useState(room.payers[0].id);
  const [beginEditedPayItem, _setBeginEditedPayItem] = useState<PayItem | null>(null);
  const [payItemSeparate, _setPayItemSeparate] = useState('');
  const payItemResult = useMemo(() => PayItemD.utils.payStrSeparator(payItemSeparate), [payItemSeparate]);
  const payItemError = useError(payItemResult);

  const callPayItemCreateApi = useCallApi('payItem/create', 'post');
  const callPayItemDeleteApi = useCallApi('payItem/delete', 'delete');
  const callPayItemUpdateApi = useCallApi('payItem/update', 'patch');
  const callPayerPutApi = useCallApi('payer/put', 'put');

  function setBeginEditedPayItem(item: typeof beginEditedPayItem) {
    _setBeginEditedPayItem(item);
    setPayItemSeparate(item ? `${item.name}/${item.amount}` : '');
  }
  const setSelectedPayerId = flow(_setSelectedPayerId, () => setBeginEditedPayItem(null));
  const setPayItemSeparate = flow(_setPayItemSeparate, payItemError.hiddenError);

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
  const handlePayerSubmit: PayerModifyDrawerProps['onSubmit'] = (previousPayerNames, payerNames) => {
    if (!selectedPayerId) throw Error('payerId가 없습니다.');
    callPayerPutApi.submit(fetcher, { roomId: room.id, payerNames: payerNames });
    setIsModifyPayerMode(false);
  };

  // PayerId가 없을시 세팅해줌.
  useEffect(() => {
    if (!selectedPayerId) setSelectedPayerId(room.payers[0].id);
  }, []);

  // 기존에 selected 되어있던 payer을 삭제한 경우 다시 새로운 payers[0]을 selected
  useEffect(() => {
    if (!actionData || !room) return;
    switch (actionData.kind) {
      case 'putPayers': {
        if (isSuccessMessage(actionData) && !room.payers.some(payer => payer.id === selectedPayerId)) {
          setSelectedPayerId(room.payers[0].id);
        }
      }
    }
  }, [room]);

  function handlePayItemCreate() {
    const result = PayItemD.utils.payStrSeparator(payItemSeparate);
    if (isRight(result)) {
      callPayItemCreateApi.submit(fetcher, { roomId: room.id, payerId: selectedPayerId, payItem: result.right });
      setPayItemSeparate('');
      setTimeout(() => {
        addPayItemScrollRef.current?.scrollTo({
          top: addPayItemScrollRef.current.clientHeight,
          behavior: 'smooth',
        });
      }, 200);
    } else {
      payItemError.showError();
    }
  }

  function handlePayItemDelete() {}
  function handlePayItemUpdate() {}

  const handleEnter = domUtils.onEnter(handlePayItemCreate);

  return (
    <>
      <RoomHeader
        room={room}
        Right={() => (
          <Button className="w-44 h-44 text-primary400  underline underline-offset-1" onClick={handlePayItemSubmit}>
            저장
          </Button>
        )}
      />
      <__PayerSelectNavigation
        onNewPayer={() => setIsModifyPayerMode(true)}
        payers={room.payers}
        selectedPayerId={selectedPayerId}
        setSelectedPayerId={setSelectedPayerId}
      />

      <div className="relative flex flex-col flex-auto overflow-hidden">
        <div className="flex flex-auto flex-col justify-between bg-lightgrey100 overflow-y-hidden">
          <div className="w-full px-16 py-12 overflow-y-scroll" key={selectedPayerId} ref={addPayItemScrollRef}>
            <div>
              <div className="flex mb-16 px-8">
                <>
                  <div>
                    <strong className="font-bold text-heading text-darkgrey300">
                      <AnimatedNumber value={payerTotalMount} comma />
                      <span className="ml-4">원</span>
                    </strong>
                    <Button className="text-caption1 pr-8" size="sm" onClick={() => setIsBankAccountOpen(true)}>
                      <SvgPlusSquare className="stroke-grey300" />
                      <span className="text-grey300 ml-[2px]">계좌 추가</span>
                    </Button>
                  </div>
                  <span className="ml-auto mt-auto text-right text-caption3 font-light">
                    마지막 업데이트
                    <br />
                    {lastUpdateDateStr}
                  </span>
                </>
              </div>
              <hr className="border-1 border-darkgrey300" />

              <div className="px-8 pt-8">
                {selectedPayerData?.payItems.map(payItem => {
                  const isEditedItem = payItem.id === beginEditedPayItem?.id;
                  return (
                    <div key={payItem.id} className="flex h-44 border-b-1 border-b-lightgrey200 text-darkgrey300">
                      <Button
                        className={clsx(
                          'flex flex-auto text-body2 hover:font-semibold',
                          isEditedItem && 'font-semibold text-primary400',
                        )}
                        size="sm"
                        onClick={() => {
                          setBeginEditedPayItem(isEditedItem ? null : payItem);
                        }}>
                        <span>{payItem.name}</span>
                        <span className="ml-auto underline underline-offset-1">
                          {numberUtils.thousandsSeparators(payItem.amount)}
                        </span>
                      </Button>
                      <Button className="min-w-32 stroke-darkgrey100 hover:stroke-darkgrey200" size="sm">
                        <SvgCross width={16} height={16}></SvgCross>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="shadow-100 px-20 py-12 bg-white">
            <p className="text-caption1 text-darkgrey100 mb-4 font-light">입력 예) 택시/12,000</p>
            <ButtonInput
              button={{
                className: 'min-w-64',
                ...(beginEditedPayItem
                  ? { children: '수정', onClick: handlePayItemCreate }
                  : { children: '추가', onClick: handlePayItemCreate }),
              }}
              value={payItemSeparate}
              onChange={e => setPayItemSeparate(e.target.value)}
              onKeyDown={handleEnter}
              ref={addPayItemInputRef}
            />
            <p className="flex text-caption1 font-light">
              <span className="text-warning">
                {payItemError.viewError?.message && '위 가이드와 같은 형식으로 입력 부탁해!'}
              </span>
              <span className="ml-auto">
                <span className={clsx(payItemError.viewError ? 'text-warning' : 'text-darkgrey100')}>
                  {E.isRight(payItemResult) ? payItemResult.right.name.length : 0}
                </span>
                /8
              </span>
            </p>
          </div>
        </div>
      </div>

      {selectedPayerData && (
        <__BankAccountInputModal
          open={isBankAccountOpen}
          onClose={() => setIsBankAccountOpen(false)}
          payer={selectedPayerData}
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
