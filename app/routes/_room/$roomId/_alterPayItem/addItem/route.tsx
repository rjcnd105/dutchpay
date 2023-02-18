import type { PayItem, Room } from '@prisma/client';
import {
  Link,
  useActionData,
  useFetcher,
  useOutletContext,
} from '@remix-run/react';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AnimatedNumber from '~/components/ui/AnimatedNumber';
import Button from '~/components/ui/Button';
import SvgPlusSquare from '~/components/ui/Icon/PlusSquare';
import { PayItemD } from '~/domain/PayItemD';
import type { Message } from '~/module/Message';
import { isSuccessMessage } from '~/module/Message';
import BankAccountInputModal from '~/components/article/BankAccountInputModal';
import type { ApiProps } from '~/service/api';
import { useCallApi } from '~/service/api';
import pathGenerator from '~/service/pathGenerator';
import { db } from '~/utils/db.server';
import type { LoaderArgs } from '@remix-run/server-runtime';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import type { PayerModifyDrawerProps } from '~/components/article/PayerFormDrawer';
import PayerFormDrawer from '~/components/article/PayerFormDrawer';
import RoomHeader from '~/components/article/RoomHeader';
import PayItemSeparatorInput from '~/domain/PayItemD/modules/PayItemSeparatorInput';
import PayerSelectNavigation from '~/components/article/PayerSelectNavigation';
import { flow } from '@fp-ts/core/Function';
import { RoomD } from '~/domain/RoomD';
import { isFailure } from '@fp-ts/schema';
import PayListItem from './PayListItem';
import usePayItemSeparatorInput from '~/domain/PayItemD/modules/PayItemSeparatorInput/usePayItemSeparatorInput';
import type { RoomOutletContextData } from '~/routes/_room/_index';

export async function loader(args: LoaderArgs) {
  const roomIdResult = RoomD.idDecode(args.params.roomId);

  if (isFailure(roomIdResult)) throw Error('invalid params');

  const roomId = roomIdResult.right;

  const d = await db.room.findUnique({
    where: {
      id: roomId,
    },
    select: {
      payItems: {
        include: {
          exceptedPayers: true,
        },
      },
      payers: {
        include: {
          payItems: true,
        },
      },
    },
  });

  return typedjson(d);
}

export default function route() {
  const fetcher = useFetcher();

  const loaderData = useTypedLoaderData<typeof loader>();

  const room = useOutletContext<RoomOutletContextData>();
  if (!room || !loaderData) throw Error('room is undefined');

  const actionData = useActionData<Message>();
  const addPayItemScrollRef = useRef<HTMLDivElement>(null);

  const [isBankAccountOpen, setIsBankAccountOpen] = useState(false);
  const [isModifyPayerMode, setIsModifyPayerMode] = useState(false);
  const [selectedPayerId, _setSelectedPayerId] = useState(
    loaderData.payers[0].id,
  );
  const [editedPayItem, _setEditedPayItem] = useState<PayItem | null>(null);

  const callPayItemCreateApi = useCallApi('payItem/create', 'post');
  const callPayItemDeleteApi = useCallApi('payItem/delete', 'delete');
  const callPayItemUpdateApi = useCallApi('payItem/update', 'patch');
  const callPayerPutApi = useCallApi('payer/put', 'put');

  const setSelectedPayerId = flow(_setSelectedPayerId, () =>
    _setEditedPayItem(null),
  );

  const payItemInput = usePayItemSeparatorInput();

  // edit PayItem 선택
  const setEditedPayItem = useCallback((editPayItem: typeof editedPayItem) => {
    _setEditedPayItem(editPayItem);

    payItemInput.setValue(
      editPayItem === null
        ? ''
        : PayItemD.utils.makePayStrSeparators(editPayItem),
    );
  }, []);

  // 선택된 Payer의 데이터
  const selectedPayerData = useMemo(
    () => loaderData.payers.find(payer => payer.id === selectedPayerId),
    [selectedPayerId, loaderData.payers],
  );

  // 아이템들의 총액
  const payerTotalMount = useMemo(
    () =>
      selectedPayerData?.payItems.reduce((pv, cv) => pv + cv.amount, 0) ?? 0,
    [selectedPayerData],
  );

  // 마지막 업데이트
  const lastUpdateDateStr = useMemo(
    () =>
      selectedPayerData?.paymentItemLastUpdatedDate &&
      format(
        new Date(selectedPayerData?.paymentItemLastUpdatedDate),
        'yy.MM.dd HH:mm',
      ),
    [selectedPayerData?.paymentItemLastUpdatedDate],
  );

  // Payer 저장
  const handlePayerSubmit: PayerModifyDrawerProps['onSubmit'] = (
    previousPayerNames,
    payerNames,
  ) => {
    if (!selectedPayerId) throw Error('payerId가 없습니다.');
    callPayerPutApi.submit(fetcher, {
      roomId: room.id,
      payerNames: payerNames,
    });
    setIsModifyPayerMode(false);
  };

  // 기존에 selected 되어있던 payer을 삭제한 경우 다시 새로운 payers[0]을 selected
  useEffect(() => {
    if (!actionData || !room) return;
    switch (actionData.kind) {
      case 'putPayers': {
        if (
          isSuccessMessage(actionData) &&
          !loaderData.payers.some(payer => payer.id === selectedPayerId)
        ) {
          setSelectedPayerId(loaderData.payers[0].id);
        }
      }
    }
  }, [room]);

  function handlePayItemCreate(data: ApiProps['payItem/create']) {
    callPayItemCreateApi.submit(fetcher, data);
    payItemInput.setValue('');
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
      if (editedPayItem && editedPayItem.id === data.payItemId)
        _setEditedPayItem(null);
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
      <PayerSelectNavigation
        onNewPayer={onNewPayer}
        payers={loaderData.payers}
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
                  {...payItemInput.props}
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
                  {...payItemInput.props}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedPayerData && (
        <BankAccountInputModal
          open={isBankAccountOpen}
          onClose={() => setIsBankAccountOpen(false)}
          payer={selectedPayerData}
          onSubmit={() => setIsBankAccountOpen(false)}
        />
      )}
      <PayerFormDrawer
        isOpen={isModifyPayerMode}
        onClose={() => setIsModifyPayerMode(false)}
        previousPayerNames={loaderData.payers.map(({ name }) => name)}
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
