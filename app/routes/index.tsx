import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import PayerForm from '~/components/article/PayerForm';

import { useSetState } from '~/hooks/useSetState';
import { useCallApi } from '~/service/api';
import pathGenerator from '~/service/pathGenerator';
import { db } from '~/utils/db.server';
import { getStringFormData } from '~/utils/remixUtils';

export function loader({ request, params }: DataFunctionArgs) {
  return null;
}

export async function action({ request }: DataFunctionArgs) {
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

const index = () => {
  const fetcher = useFetcher();
  const payers = useSetState([]);
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
        payers={payers.state}
        onPayerAdd={name => payers.add(name)}
        onPayerRemove={name => payers.remove(name)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default index;
