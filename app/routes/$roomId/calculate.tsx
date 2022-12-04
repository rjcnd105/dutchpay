import { Link, useFetcher, useOutletContext } from '@remix-run/react';
import type { OutletContextData } from '~/routes/$roomId';
import RoomHeader from '../__components/__RoomHeader';
import pathGenerator from '~/service/pathGenerator';
import Button from '~/components/ui/Button';
import SvgArrowLeft from '~/components/ui/Icon/ArrowLeft';
import SvgShare1 from '~/components/ui/Icon/Share1';
import { share } from '~/utils/appUtils';
import { useMemo } from 'react';
import Checkbox from '~/components/ui/Checkbox';
import type { Payer, PayItem } from '@prisma/client';
import { useCallApi } from '~/service/api';
import clsx from 'clsx';
import numberUtils from '~/utils/numberUtils';
import { useDebounce, useDebouncedCallback } from 'use-debounce';


export default function Calculate() {
  const fetcher = useFetcher();
  const room = useOutletContext<OutletContextData>();
  if (!room) return null;

  const callAddPayItemsExcept = useCallApi('payer/addPayItemsExcept', 'post');
  const callClearPayItemsExcept = useCallApi('payer/clearPayItemsExcept', 'post');
  const callAddExceptPayer = useCallApi('payItem/addExceptPayer', 'post');
  const callRemoveExpectPayer = useCallApi('payItem/removeExceptPayer', 'post');

  const payItemIds = useMemo(() => room.payItems.map(payItem => payItem.id), [room.payItems])
  


  return (
    <>
      <RoomHeader
        roomName={room.name}
        roomId={room.id}
        Left={
          <Link
            className='flex items-center justify-center min-w-56 h-44'
            to={pathGenerator.room.addItem({ roomId: room.id })}>
            <SvgArrowLeft width={32} height={32} />
          </Link>
        }
        Right={
          <Button
            className='min-w-56'
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
      <div className='flex flex-auto overflow-x-auto flex-col'>
        <ul className='flex h-52 pl-[114px]'>
          {room.payers.map(payer => (
            <li className='flex-center px-4 font-light text-black min-w-[70px] min-h-[52px]'>
              {payer.name}
            </li>
          ))}
        </ul>
        <ul className='flex bg-primary300 h-40 pl-[114px] '>
          {room.payers.map(payer => {
            const exceptCheckItemLength = payer.exceptedItems.length ?? 0;
            return (
              <li key={`${payer.id}-check`} className='flex-center min-w-[70px] h-[40px]'>
                
                <Checkbox
                  id={`${payer.id}`}
                  value={`${payer.id}`}
                  defaultChecked={exceptCheckItemLength === 0}
                  onChange={({checked}) => {
                    console.log(checked, "checked")
                    if (checked === true) callClearPayItemsExcept.submit(fetcher, { payerId: payer.id });
                    else if(checked === false) callAddPayItemsExcept.submit(fetcher, { payerId: payer.id, payItemIds });
                  }}
                />
              </li>
            );
          })}
        </ul>
        <div className='flex-auto overflow-y-auto'>
          {room.payItems.map((payItem, i) => {
            const amountPerPayer = payItem.exceptedPayers.length === 0 ? payItem.amount : Math.floor(payItem.amount / payItem.exceptedPayers.length);
            const exceptedPayerSet = new Set(payItem.exceptedPayers.map(({ payerId }) => payerId));
            return <ul
              key={`${payItem.id}-item`}
              className={clsx('flex h-[66px] border-b-primary200 border-b-1', (i % 2 == 0) ? 'bg-primary50' : 'bg-lightgrey100')}>
              <li className='flex flex-col flex-center min-w-[114px] border-dashed border-r-2 border-r-primary300'>
                <Button className='flex flex-col font-light hover:font-regular w-full'>
                  <span>
                  {payItem.name}
                  </span>
                  <span className='font-extralight underline'>
                    {numberUtils.thousandsSeparators(payItem.amount)}
                  </span>
                </Button>
              </li>
              {room.payers.map(payer => {
                const isChecked = exceptedPayerSet.has(payer.id);
                const id = `${payItem.id}-${payer.id}`;
                const key = `${id}-${isChecked ? "checked" : "unchecked"}`;
                return <li key={key}
                           className='flex min-w-[70px] h-full'>
               
                    <Checkbox
                      key={id}
                      id={id}
                      value={id}
                      defaultChecked={isChecked}
                      onChange={({checked}) => {
                        if (checked === true) callRemoveExpectPayer.submit(fetcher, { payerId: payer.id, payItemId: payItem.id });
                        else if(checked === false) callAddExceptPayer.submit(fetcher, { payerId: payer.id, payItemId: payItem.id });
                      }
                      }
                    >
                      <span key={key} className='text-darkgrey100 text-caption2'>
                        {numberUtils.thousandsSeparators(amountPerPayer)}
                      </span>
                    </Checkbox>
                      
                </li>;
              })}
            </ul>;
          })}
        </div>

      </div>
      <div className='flex-center min-h-[116px] px-20'>
        <Button theme='solid/blue' className='w-full'>
          정산하기
        </Button>
      </div>
    </>
  );
}
