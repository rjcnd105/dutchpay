import { Link, useFetcher, useOutletContext } from '@remix-run/react';
import pathGenerator from '~/service/pathGenerator';
import Button from '~/components/ui/Button';
import SvgArrowLeft from '~/components/ui/Icon/ArrowLeft';
import SvgShare1 from '~/components/ui/Icon/Share1';
import { share } from '~/utils/appUtils';
import { useCallback, useMemo, useRef, useState } from 'react';
import Checkbox from '~/components/ui/Checkbox';
import type { PayItem, PayItemForPayer } from '@prisma/client';
import type { ApiProps } from '~/service/api';
import { useCallApi } from '~/service/api';
import clsx from 'clsx';
import numberUtils from '~/utils/numberUtils';
import { db } from '~/utils/db.server';
import type { DataFunctionArgs } from '@remix-run/node';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import RoomHeader from '~/components/article/RoomHeader';
import Index from '~/domain/PayItemD/modules/PayItemSeparatorInput';
import { PayItemD } from '~/domain/PayItemD';
import { RoomD } from '~/domain/RoomD';
import { isFailure } from '@fp-ts/schema';
import type { RoomOutletContextData } from '~/routes/_room/_index';

export async function loader(args: DataFunctionArgs) {
  const parseResult = RoomD.decode(args.params);
  if (isFailure(parseResult)) throw new Error('invalid roomId');

  const roomId = parseResult.right.id;

  const [payItems, payers] = await Promise.all([
    db.payItem.findMany({
      where: {
        roomId,
      },
      include: {
        exceptedPayers: true,
      },
    }),
    db.payer.findMany({
      where: {
        roomId,
      },
      include: {
        exceptedItems: true,
      },
    }),
  ]);

  return typedjson({
    payItems,
    payers,
  });
}

const makeItemId = ({
  payerId,
  payItemId,
}: Pick<PayItemForPayer, 'payItemId' | 'payerId'>) =>
  `payer-${payerId}_payItem-${payItemId}`;
// const useAmountPayItemForPayerMap = (payItems:  (PayItem & {exceptedPayers: PayItemForPayer[]})[]) => {
//
//   const d = useMemo(() => {
//     const map = new Map()
//
//     for (const payItem of payItems) {
//
//       for (const exceptedPayer of payItem.exceptedPayers) {
//         const itemId = makeItemId(exceptedPayer.payerId, payItem.id)
//
//       }
//     }
//
//     return map
//   }, [])
// }

export default function route() {
  const fetcher = useFetcher();
  const { payers, payItems } = useTypedLoaderData<typeof loader>();
  const editedPayItemInputRef = useRef<HTMLInputElement>(null);

  const [editedPayItem, _setEditedPayItem] = useState<PayItem | null>(null);
  const [editedPayItemInputValue, setEditedPayItemInputValue] = useState('');

  // edit PayItem 선택
  const setEditedPayItem = useCallback((editPayItem: typeof editedPayItem) => {
    _setEditedPayItem(editPayItem);
    setEditedPayItemInputValue(
      editPayItem === null
        ? ''
        : PayItemD.utils.makePayStrSeparators(editPayItem),
    );
  }, []);

  const callPayItemUpdateApi = useCallApi('payItem/update', 'patch');

  function handlePayItemUpdate(data: ApiProps['payItem/update']) {
    callPayItemUpdateApi.submit(fetcher, data);
  }

  const room = useOutletContext<RoomOutletContextData>();
  if (!room) return null;

  const callAddPayItemsExcept = useCallApi('payer/addPayItemsExcept', 'post');
  const callClearPayItemsExcept = useCallApi(
    'payer/clearPayItemsExcept',
    'post',
  );
  const callAddExceptPayer = useCallApi('payItem/addExceptPayer', 'post');
  const callRemoveExpectPayer = useCallApi('payItem/removeExceptPayer', 'post');

  const payItemIds = useMemo(
    () => payItems.map(payItem => payItem.id),
    [payItems],
  );

  return (
    <>
      <RoomHeader
        roomName={room.name}
        roomId={room.id}
        Left={
          <Link
            className="flex items-center justify-center min-w-56 h-44"
            to={pathGenerator.room.addItem({ roomId: room.id })}>
            <SvgArrowLeft width={32} height={32} />
          </Link>
        }
        Right={
          <Button
            className="min-w-56"
            onClick={() => {
              if (typeof window !== 'undefined') {
                share({
                  title: '영수증을 공유해요!',
                  url: window.location.href,
                });
              }
            }}>
            <SvgShare1 width={28} height={28} />
          </Button>
        }
      />
      <div className="flex flex-auto overflow-x-auto flex-col">
        <ul className="flex h-52 pl-[114px]">
          {payers.map(payer => (
            <li
              key={payer.id}
              className="flex-center px-4 font-light text-black min-w-[70px] min-h-[52px]">
              {payer.name}
            </li>
          ))}
        </ul>
        <ul className="flex bg-primary300 h-40 pl-[114px] ">
          {payers.map(payer => {
            const exceptCheckItemLength = payer.exceptedItems.length ?? 0;
            return (
              <li
                key={`${payer.id}-check`}
                className="flex-center min-w-[70px] h-[40px]">
                <Checkbox
                  id={`${payer.id}`}
                  value={`${payer.id}`}
                  defaultChecked={exceptCheckItemLength === 0}
                  onCheckedChange={state => {
                    if (state === true)
                      callClearPayItemsExcept.submit(fetcher, {
                        payerId: payer.id,
                      });
                    else if (state === false)
                      callAddPayItemsExcept.submit(fetcher, {
                        payerId: payer.id,
                        payItemIds,
                      });
                  }}
                />
              </li>
            );
          })}
        </ul>
        <div className="flex-auto overflow-y-auto">
          {payItems.map((payItem, i) => {
            const exceptPayPayers: Array<[string, PayItemForPayer]> =
              payItem.exceptedPayers
                .filter(d => d.whetherToPay)
                .map(payerPayItem => [makeItemId(payerPayItem), payerPayItem]);

            const payPayersMap = new Map(exceptPayPayers);

            const extraAmount = [...payPayersMap.values()].reduce((acc, cv) => {
              return acc + (cv.whetherToPay ? cv.extraAmount : 0);
            }, 0);

            const payerNum = payers.length - exceptPayPayers.length;

            const amountPerPayer =
              payerNum === 0
                ? payItem.amount
                : Math.floor((payItem.amount - extraAmount) / payerNum);

            const bg = i % 2 == 0 ? 'bg-primary50' : 'bg-lightgrey100';
            return (
              <ul key={`${payItem.id}-item`} className="flex h-[66px]">
                <li
                  className={clsx(
                    'flex flex-col flex-center min-w-[114px] border-dashed border-r-2 border-r-primary300 border-b-primary200 border-b-1',
                    bg,
                  )}>
                  <Button
                    className="flex flex-col font-light hover:font-regular w-full"
                    onClick={() => {
                      console.log('hihihihi', 'hihihihi');
                      setEditedPayItem(payItem);
                    }}>
                    <span
                      className={clsx(
                        editedPayItem?.id === payItem.id &&
                          'font-semibold text-primary400',
                      )}>
                      {payItem.name}
                    </span>
                    <span className="font-extralight underline">
                      {numberUtils.thousandsSeparators(payItem.amount)}
                    </span>
                  </Button>
                </li>
                {payers.map(payer => {
                  const itemId = makeItemId({
                    payerId: payer.id,
                    payItemId: payItem.id,
                  });
                  const payPayerItem = payPayersMap.get(itemId);
                  const isMorePayer = payPayerItem?.extraAmount ?? 0 > 0;
                  const isLessPayer = payPayerItem?.extraAmount ?? 0 < 0;
                  const id = `payItem${payItem.id}-payer${
                    payer.id
                  }-${!!payPayerItem}`;
                  return (
                    <li
                      key={id}
                      className={clsx(
                        'flex flex-col items-center min-w-[70px] h-full border-b-primary200 border-b-1',
                        bg,
                      )}>
                      <Checkbox
                        id={id}
                        value={id}
                        defaultChecked={!payPayerItem}
                        onCheckedChange={state => {
                          if (state === true)
                            callRemoveExpectPayer.submit(fetcher, {
                              payerId: payer.id,
                              payItemId: payItem.id,
                            });
                          else if (state === false)
                            callAddExceptPayer.submit(fetcher, {
                              payerId: payer.id,
                              payItemId: payItem.id,
                            });
                        }}
                      />

                      <label
                        htmlFor={id}
                        className={clsx(
                          'text-darkgrey100 text-caption2',
                          isMorePayer && 'bg-warning',
                          isLessPayer && 'bg-success',
                        )}>
                        {numberUtils.thousandsSeparators(amountPerPayer)}
                      </label>
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </div>
      </div>
      <div className="flex-center min-h-[116px] px-20">
        <Button theme="solid/blue" className="w-full">
          정산하기
        </Button>
        {!!editedPayItem && (
          <div className="absolute inset-0">
            <Index
              buttonText="수정"
              onItemSubmit={payItem =>
                handlePayItemUpdate({
                  payItem: { id: editedPayItem.id, ...payItem },
                  payerId: editedPayItem.paidPayerId,
                })
              }
              value={editedPayItemInputValue}
              onChange={e => setEditedPayItemInputValue(e.target.value)}
              ref={editedPayItemInputRef}
            />
          </div>
        )}
      </div>
    </>
  );
}
