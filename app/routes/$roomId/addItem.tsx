import type { Payer, PayItem, Room } from '@prisma/client';
import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useActionData, useFetcher, useLocation, useOutlet, useSearchParams, useSubmit } from '@remix-run/react';
import clsx from 'clsx';
import equal from 'fast-deep-equal';
import { isRight } from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as ReadonlyArray from 'fp-ts/lib/ReadonlyArray';
import { produce } from 'immer';
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, useTransition } from 'react';
import { useOutletContext } from 'react-router';

import AnimatedNumber from '~/components/ui/AnimatedNumber';
import Button from '~/components/ui/Button';
import ButtonInput from '~/components/ui/ButtonInput';
import Drawer from '~/components/ui/Drawer';
import SvgCross from '~/components/ui/Icon/Cross';
import SvgPlus from '~/components/ui/Icon/Plus';
import SvgPlusSquare from '~/components/ui/Icon/PlusSquare';
import Input from '~/components/ui/Input';
import { PayItemD } from '~/domain/PayItemD';
import type { SetState } from '~/hooks/useSetState';
import { useSetState } from '~/hooks/useSetState';
import type { Message } from '~/model/Message';
import { isSuccessMessage, message } from '~/model/Message';
import __BankAccountInputModal from '~/routes/__components/__BankAccountInputModal';
import __PayerForm from '~/routes/__components/__PayerForm';
import __PayerSelectNavigation from '~/routes/__components/__PayerSelectNavigation';
import RoomHeader from '~/routes/__components/__RoomHeader';
import type { AllRoomData, OutletContextData } from '~/routes/$roomId';
import pathGenerator from '~/service/pathGenerator';
import { MapValue } from '~/types/utils';
import { db } from '~/utils/db.server';
import domUtils from '~/utils/domUtils';
import numberUtils from '~/utils/numberUtils';
import { getStringFormData } from '~/utils/remixUtils';

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

  const [selectedPayerId, setSelectedPayerId] = useState(room.payers[0].id);
  const [payItemSeparate, setPayItemSeparate] = useState('');

  const [payerData, payerDataDispatch] = useReducer(payItemFormReducer, room.payers);
  const selectedPayerData = useMemo(
    () => payerData.find(payer => payer.id === selectedPayerId),
    [selectedPayerId, payerData],
  );
  const payerTotalMount = useMemo(
    () => selectedPayerData?.payItems.reduce((pv, cv) => pv + cv.amount, 0) ?? 0,
    [selectedPayerData],
  );
  // 결제 내역 저장
  function handlePayItemSubmit() {
    const formData = new FormData();
    formData.set('roomId', room.id);
    formData.set('payerPayData', JSON.stringify(payerData));

    console.log('addItem.tsx', '결제내역저장');

    fetcher.submit(formData, { action: '/api/putPayItems', method: 'put', replace: true });
  }

  // Payer 저장
  const handlePayerSubmit: PayerModifyDrawerProps['onSubmit'] = (previousPayerNames, payerNames) => {
    if (!selectedPayerId) throw Error('payerId가 없습니다.');

    const formData = new FormData();
    formData.set('roomId', room.id);
    formData.set('payerId', `${selectedPayerId}`);
    formData.set('previousNames', previousPayerNames.join(','));
    formData.set('names', payerNames.join(','));
    fetcher.submit(formData, { action: '/api/putPayers', method: 'put', replace: true });
    setIsModifyPayerMode(false);
  };

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

  // PayerId가 없을시 세팅해줌.
  useEffect(() => {
    if (!selectedPayerId) setSelectedPayerId(room.payers[0].id);
  }, []);

  function handlePayItemAdd() {
    const result = PayItemD.utils.payStrSeparator(payItemSeparate);
    if (isRight(result)) {
      const { name, amount } = result.right;
      payerDataDispatch({ type: 'ADD', value: { name, amount, payerId: selectedPayerId, roomId: room.id } });
      setPayItemSeparate('');
      setTimeout(() => {
        console.log('addItem.tsx', 'addPayItemPanelRef', addPayItemScrollRef);
        addPayItemScrollRef.current?.scrollTo({
          top: addPayItemScrollRef.current.clientHeight,
          behavior: 'smooth',
        });
      }, 200);
    }
  }

  const handleEnter = domUtils.onEnter(handlePayItemAdd);

  return (
    <>
      <RoomHeader
        room={room}
        Right={({ room }) => (
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
        <div className="empty-pay-items flex flex-col flex-auto items-center justify-center">
          <img className="w-[205px] h-[178px]" src="/images/main_illustrate.svg" alt="main_illustrate" />
          <p className="mt-16">등록한 내역이 없어!</p>
          <Button
            className="mt-48 min-w-[112px]"
            theme="solid/subOrange"
            onClick={() =>
              payerDataDispatch({
                type: 'EMPTY_ADDS',
                value: { payerId: selectedPayerId, roomId: room.id },
                length: 10,
              })
            }>
            <SvgPlus className="stroke-white" /> 내역 추가
          </Button>
        </div>
        <div
          className={clsx(
            'page_room_addItem-panel absolute inset-0 flex flex-col justify-between bg-white overflow-y-hidden',
            selectedPayerData && selectedPayerData.payItems.length > 0 && 'active',
          )}>
          <div className="w-full px-20 py-12 overflow-y-scroll" key={selectedPayerId} ref={addPayItemScrollRef}>
            <div>
              <div className="mb-16">
                <strong className="font-bold text-heading text-darkgrey300">
                  <AnimatedNumber value={payerTotalMount} comma />
                  <span className="ml-4">원</span>
                </strong>
                <Button className="pr-8" size="sm" onClick={() => setIsBankAccountOpen(true)}>
                  <SvgPlusSquare className="stroke-grey300" />
                  <span className="text-grey300 ml-[2px]">계좌 추가</span>
                </Button>
              </div>
              {selectedPayerData?.payItems.map(payItem => {
                return (
                  <div key={payItem.id} className="flex gap-x-24 mb-24">
                    <Input
                      key={`${payItem.id}-name`}
                      defaultValue={payItem.name}
                      name="item-name"
                      wrapClassName="basis-[176px]"
                      type="text"
                      placeholder="사용처"
                      onBlur={e => {
                        payerDataDispatch({ type: 'SET', value: { ...payItem, name: e.target.value.trim() } });
                      }}
                      hasUnderline
                    />
                    <Input
                      key={`${payItem.id}-amount`}
                      defaultValue={payItem.amount}
                      name="item-amount"
                      wrapClassName="basis-[135px]"
                      placeholder="금액"
                      type="money"
                      onBlur={e => {
                        console.log('addItem.tsx', 'e.target.value', e.target['ariaValueNow']);
                        payerDataDispatch({
                          type: 'SET',
                          value: { ...payItem, amount: Number(e.target['ariaValueNow']) },
                        });
                      }}
                      hasUnderline
                    />
                  </div>
                );
              })}
            </div>

            <div>
              <Button
                className="mx-auto"
                onClick={() =>
                  payerDataDispatch({
                    type: 'EMPTY_ADDS',
                    value: { payerId: selectedPayerId, roomId: room.id },
                    length: 10,
                  })
                }>
                <SvgPlus className="stroke-grey300" />빈 내역 10개 추가
              </Button>
            </div>
          </div>
          <div className="shadow-100 px-20 py-12 bg-white">
            <p className="text-caption1 text-darkgrey100 mb-4 font-light">금액/사용처 예) 택시/12,000</p>
            <ButtonInput
              button={{ children: '추가', className: 'min-w-64', onClick: handlePayItemAdd }}
              value={payItemSeparate}
              onChange={e => setPayItemSeparate(e.target.value)}
              onKeyDown={handleEnter}
              ref={addPayItemInputRef}
            />
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
      <PayerAddDrawer
        isOpen={isModifyPayerMode}
        onClose={() => setIsModifyPayerMode(false)}
        previousPayerNames={room.payers.map(({ name }) => name)}
        onSubmit={handlePayerSubmit}
      />
    </>
  );
}

type PayerModifyDrawerProps = {
  previousPayerNames: string[];
  onSubmit: (previousPayerNames: Array<Payer['name']>, payerNames: Array<Payer['name']>) => void;
  isOpen: boolean;
  onClose: () => void;
};

const PayerAddDrawer = ({ previousPayerNames, isOpen, onSubmit, onClose }: PayerModifyDrawerProps) => {
  const tempPayers = useSetState(previousPayerNames);
  const ref = useRef<HTMLInputElement>(null);

  function handleAdd(name: string) {
    tempPayers.add(name);
    ref.current?.focus();
  }

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => ref.current?.focus());
    else tempPayers.reset();
  }, [isOpen]);

  return (
    <Drawer open={isOpen} placement="bottom" onClose={onClose}>
      <div className="flex flex-col h-[90vh] w-[100vw] rounded-t-[24px] py-[18px] px-[20px] max-h-[476px]">
        <header className="drawer-head mb-8">
          <Button className="w-[28px] h-[28px] px-0" onClick={onClose}>
            <SvgCross width={28} height={28} />
          </Button>
        </header>
        <__PayerForm
          payers={tempPayers.state}
          onPayerAdd={handleAdd}
          onPayerRemove={tempPayers.remove}
          onSubmit={() => onSubmit(tempPayers.defaultState, tempPayers.state)}
          inputRef={ref}
        />
      </div>
    </Drawer>
  );
};
