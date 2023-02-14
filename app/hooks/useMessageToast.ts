import { useActionData } from '@remix-run/react';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import type { Message } from '~/module/Message';
import { isMessage } from '~/module/Message';

const useMessageToast = (toastMessageKinds: string[]) => {
  const toastKindSet = useMemo(
    () => new Set(toastMessageKinds),
    [toastMessageKinds],
  );
  const actionData = useActionData<unknown | Message>();

  useEffect(() => {
    if (!actionData && !isMessage(actionData)) return;
    if (toastKindSet.has((actionData as Message).kind)) {
      toast((actionData as Message).text, {
        type: (actionData as Message).status,
      });
    }
  }, [actionData]);
};
export default useMessageToast;
