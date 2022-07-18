import type { Payer, PayItem, Room } from '@prisma/client';
import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import type { FetcherWithComponents, FormMethod } from '@remix-run/react';
import equal from 'fast-deep-equal';

import { PayItemD } from '~/domain/PayItemD';
import { message } from '~/model/Message';
import type { AllRoomData } from '~/routes/$roomId';
import pathGenerator from '~/service/pathGenerator';
import { db } from '~/utils/db.server';
import { getStringFormData } from '~/utils/remixUtils';

export type ApiDataType = {
  createRoom: {
    names: Array<Room['name']>;
  };
  roomNameModify: {
    room: Pick<Room, 'id' | 'name'>;
  };
  putPayers: {
    roomId: Room['id'];
    payerNames: Array<Payer['name']>;
  };
  addPayItem: {
    roomId: Room['id'];
    payerId: Payer['id'];
    payItem: Pick<PayItem, 'name' | 'amount'>;
  };
  modifyPayItem: {
    payerId: Payer['id'];
    payItem: Pick<PayItem, 'id' | 'name' | 'amount'>;
  };
  removePayItem: {
    roomId: Room['id'];
    payItemId: PayItem['id'];
  };
  inputBankAccount: {
    payer: Pick<Payer, 'id' | 'BankAccountNumber'>;
  };
};

const apiMethod: Record<keyof ApiDataType, FormMethod> = {
  createRoom: 'post',
  roomNameModify: 'patch',
  putPayers: 'put',
  addPayItem: 'post',
  modifyPayItem: 'patch',
  removePayItem: 'delete',
  inputBankAccount: 'patch',
} as const;

export function callApi<K extends keyof ApiDataType>(action: keyof ApiDataType, data: ApiDataType[K]) {
  const props = {
    method: apiMethod[action],
    action: `/api/${action}`,
  };
  return {
    props,
    submit<T>(fetcher: FetcherWithComponents<T>, data: ApiDataType[K]) {
      const formData = new FormData();
      formData.set('data', JSON.stringify(data));
      fetcher.submit(formData, props);
    },
  };
}

export function receiveApi() {}

export async function action({ request, params }: DataFunctionArgs) {
  const form = await request.formData();
  const { action } = params;

  if (!action) throw Error('Action이 무엇인지 알 수 없음.');

  switch (action) {
    case 'createRoom': {
      const formData = getStringFormData(form, ['names']);

      if (formData.names === '')
        return {
          type: 'error',
          message: '이름이 입력되지 않았음',
        };

      const payerNames = formData.names.split(',');

      const room = await db.room.create({
        data: {
          name: '정산',
          payers: {
            create: payerNames.map(payerName => ({
              name: payerName,
            })),
          },
        },
      });

      return redirect(pathGenerator.room.addItem({ roomId: room.id }));
    }
    // 방 이름 변경
    case 'roomNameModify': {
      const { roomId, roomName } = getStringFormData(form, ['roomId', 'roomName']);

      return {
        _action: 'roomNameModify',
        data: await db.room.update({
          where: {
            id: roomId,
          },
          data: {
            name: roomName,
          },
        }),
      };
    }
    // Payer Put
    case 'putPayers': {
      const { roomId, names, previousNames } = getStringFormData(form, ['roomId', 'names', 'previousNames']);
      const [nameSet, previousNameSet] = [new Set(names.split(',')), new Set(previousNames.split(','))];
      const addPayers = [...nameSet].filter(name => !previousNameSet.has(name));
      const deletePayers = [...previousNameSet].filter(name => !nameSet.has(name));
      await db.$transaction([
        db.payer.deleteMany({
          where: {
            roomId,
            name: {
              in: deletePayers,
            },
          },
        }),
        db.payer.createMany({ data: addPayers.map(name => ({ roomId, name })) }),
      ]);
      return message({
        kind: 'putPayers',
        status: 'success',
        text: '',
      });
    }
    case 'addPayItem': {
      const { roomId, payerId, name, amount } = getStringFormData(form, ['roomId', 'payerId', 'name', 'amount']);
      return db.$transaction([
        db.payItem.create({
          data: {
            roomId,
            payerId: Number(payerId),
            name,
            amount: Number(amount),
          },
        }),
        db.payer.update({
          where: {
            id: Number(payerId),
          },
          data: {
            paymentItemLastUpdatedDate: new Date(),
          },
        }),
      ]);
    }
    case 'removePayItem': {
      const { payerId, payItemId } = getStringFormData(form, ['payerId', 'payItemId']);
      return db.$transaction([
        db.payItem.delete({
          where: {
            id: Number(payItemId),
          },
        }),
        db.payer.update({
          where: {
            id: Number(payerId),
          },
          data: {
            paymentItemLastUpdatedDate: new Date(),
          },
        }),
      ]);
    }
    case 'modifyPayItem': {
      const { payerId, payItemId, name, amount } = getStringFormData(form, ['payerId', 'payItemId', 'name', 'amount']);
      return db.$transaction([
        db.payItem.update({
          where: {
            id: Number(payItemId),
          },
          data: {
            name,
            amount: Number(amount),
          },
        }),
        db.payer.update({
          where: {
            id: Number(payerId),
          },
          data: {
            paymentItemLastUpdatedDate: new Date(),
          },
        }),
      ]);
    }

    // 은행 계좌 입력
    case 'inputBankAccount': {
      const { payerId, bankAccount } = getStringFormData(form, ['payerId', 'bankAccount']);
    }

    // -- duplicated --
    // PayerItem Put
    case 'putPayItems': {
      const { roomId, payerPayData } = getStringFormData(form, ['roomId', 'payerPayData']);
      const data: AllRoomData['payers'] = JSON.parse(payerPayData);

      const roomPayItems = await db.room.findUnique({ where: { id: roomId } }).payItems();
      if (roomPayItems === null) throw Error('room을 찾을 수 없습니다.');

      const roomPayItemHashMap = new Map(roomPayItems.map(payItem => [payItem.id, payItem]));

      const createItems: Pick<PayItem, 'name' | 'amount' | 'payerId'>[] = [];
      const updateItems: PayItem[] = [];
      const deleteIds: Array<PayItem['id']> = [];

      // 업데이트, 생성, 삭제할 payItem 추출
      for (const payer of data) {
        for (const payItem of payer.payItems) {
          if (payItem.name.trim() === '' && payItem.amount === 0) {
            if (roomPayItemHashMap.has(payItem.id)) deleteIds.push(payItem.id);
          } else {
            if (payItem.id < 0) createItems.push(payItem);
            else {
              const beforeItem = roomPayItemHashMap.get(payItem.id);

              if (!equal(beforeItem, payItem)) continue;
              updateItems.push(payItem);
            }
          }
        }
      }

      await db.$transaction([
        db.payItem.createMany({
          data: createItems.map(({ name, amount, payerId }) => ({
            name,
            amount,
            payerId,
            roomId,
          })),
        }),
        db.payItem.deleteMany({
          where: {
            id: {
              in: deleteIds,
            },
          },
        }),
        ...updateItems.map(({ id, name, amount, roomId, payerId }) =>
          db.payItem.update({
            where: {
              id,
            },
            data: {
              name,
              amount,
            },
          }),
        ),
      ]);
      return redirect(pathGenerator.room.result({ roomId }));
    }
  }
}
