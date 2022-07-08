import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useFetcher, useSubmit } from '@remix-run/react';
import clsx from 'clsx';
import { isRight } from 'fp-ts/lib/Either';
import { flow, pipe } from 'fp-ts/lib/function';
import { motion } from 'framer-motion';
import type { KeyboardEventHandler } from 'react';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState, useTransition } from 'react';

import Button from '~/components/ui/Button';
import ButtonInput from '~/components/ui/ButtonInput';
import { CrossCircle } from '~/components/ui/Icon';
import { PayerD } from '~/domain/PayerD';
import { RoomD } from '~/domain/RoomD';
import useError from '~/hooks/useError';
import { useSetState } from '~/hooks/useSetState';
import PayerForm from '~/routes/__components/__PayerForm';
import pathGenerator from '~/service/pathGenerator';
import arrayUtils from '~/utils/arrayUtils';
import { db } from '~/utils/db.server';
import domUtils from '~/utils/domUtils';
import { getStringFormData } from '~/utils/remixUtils';
import stringUtils from '~/utils/stringUtils';
import { foldValidatorS } from '~/utils/validation';

export function loader({ request, params }: DataFunctionArgs) {
  return null;
}

export async function action({ request }: DataFunctionArgs) {
  const formData = getStringFormData(await request.formData(), ['names']);
  const transition = useTransition();

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

const Index = () => {
  const fetcher = useFetcher();
  const payers = useSetState([]);

  function handleSubmit(_payers: string[]) {
    const formData = new FormData();
    formData.set('names', _payers.join(','));
    fetcher.submit(formData, { action: '/api/createRoom', method: 'post' });
  }

  return (
    <div className="flex flex-col pt-32 px-20 max-w-[375px] w-full mx-auto h-full max-h-[512px]">
      <label className="font-extralight text-title block mb-16">누구누구 정산할꺼야?</label>
      <PayerForm
        payers={payers.state}
        onPayerAdd={name => payers.add(name)}
        onPayerRemove={name => payers.remove(name)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Index;
