import { useActionData } from '@remix-run/react';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import type { Message } from '~/model/Message';
import { isMessage } from '~/model/Message';

const useMessageToast = (toastMessageKinds: string[]) => {
  const toastKindSet = useMemo(() => new Set(toastMessageKinds), [toastMessageKinds]);
  const actionData = useActionData<unknown | Message>();

  useEffect(() => {
    if (!actionData && !isMessage(actionData)) return;
    if (toastKindSet.has((actionData as Message).kind)) {
      toast((actionData as Message).text, {
        progress: undefined,
        type: (actionData as Message).status,
      });
    }
  }, [actionData]);
};
export default useMessageToast;
