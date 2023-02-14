import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import PayerForm from '~/components/article/PayerForm';

import { useCallApi } from '~/service/api';
import pathGenerator from '~/service/pathGenerator';
import { db } from '~/utils/db.server';
import { getStringFormData } from '~/utils/remixUtils';
import { useSnapshot } from 'valtio';
import { proxySet } from 'valtio/utils';

export async function action({ request }: DataFunctionArgs) {
  console.log('action');
  const formData = getStringFormData(await request.formData(), ['names']);

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

const Root = () => {
  const fetcher = useFetcher();
  const payers = useSnapshot(proxySet<string>([]));
  const callApi = useCallApi('room/create', 'post');

  function handleSubmit(_payers: string[]) {
    callApi.submit(fetcher, { names: _payers });
  }

  return (
    <div className="flex flex-col pt-32 px-20 max-w-[375px] w-full mx-auto h-full max-h-[512px]">
      <span className="font-extralight text-title block mb-16">
        누구누구 정산할꺼야?
      </span>
      <PayerForm
        payers={[...payers]}
        onPayerAdd={payers.add}
        onPayerRemove={payers.delete}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Root;
