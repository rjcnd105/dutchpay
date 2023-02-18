import { useCallback, useRef, useState } from 'react';
import { flow } from '@fp-ts/core/Function';
import { PayItemD } from '~/domain/PayItemD';

const usePayItemSeparatorInput = () => {
  const [value, setValue] = useState('');
  const setItem = useCallback(
    flow(PayItemD.utils.makePayStrSeparators, setValue),
    [setValue],
  );
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const ref = useRef<HTMLInputElement>(null);
  const focus = useCallback(() => {
    ref.current?.focus();
  }, [ref]);

  return { setValue, setItem, props: { ref, focus, value, onChange } };
};

export default usePayItemSeparatorInput;
