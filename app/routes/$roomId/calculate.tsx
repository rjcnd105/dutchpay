import { Link, useLocation, useOutletContext } from '@remix-run/react';
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

export default function Calculate() {
  const room = useOutletContext<OutletContextData>();
  if (!room) return null;
  const { payers, payItems } = room;
  const payItemExceptedPayerMap = useMemo(() => {
    const map = new Map<PayItem['id'], Map<Payer['id'], Payer>>();
    for (const payItem of room.payItems) {
      const exceptPayerMap = new Map<Payer['id'], Payer>(
        payItem.exceptedPayers.map(payer => [payer.id, payer]),
      );
      map.set(payItem.id, exceptPayerMap);
    }
    return map;
  }, [room.payItems]);

  return (
    <>
      <RoomHeader
        roomName={room.name}
        roomId={room.id}
        Left={
          <Link
            className="t flex items-center justify-center min-w-56 h-44"
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
      <div className="flex-auto overflow-x-auto ">
        <ul className="inline-grid grid-flow-col h-52 pl-[114px]">
          {payers.map(payer => (
            <li className="flex-center px-4 font-light text-black min-w-[68px] min-h-[52px]">
              {payer.name}
            </li>
          ))}
        </ul>
        <ul className="inline-grid grid-flow-col bg-primary300 h-40 pl-[114px] ">
          {payers.map(payer => (
            <li className="flex-center min-w-[68px] h-full">
              <Checkbox
                id={`${payer.id}`}
                value={`${payer.id}`}
                indeterminate={payer.id % 2 === 0}
                onChange={({ checked }) => {
                  console.log('calculate.tsx', 'e', checked);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-center min-h-[116px] px-20">
        <Button theme="solid/blue" className="w-full">
          정산하기
        </Button>
      </div>
    </>
  );
}
