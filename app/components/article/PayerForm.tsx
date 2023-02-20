import type { Payer } from '@prisma/client';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { RefObject } from 'react';
import React, { useMemo, useState } from 'react';

import Button from '~/components/ui/Button';
import ButtonInput from '~/components/ui/ButtonInput';
import { PayerD } from '~/domain/PayerD';
import { RoomD } from '~/domain/RoomD';
import useError from '~/hooks/useError';
import domUtils from '~/utils/domUtils';
import * as O from '@fp-ts/core/Option';
import { lazyNull } from '~/constants/common';

type Props = {
  payers: Payer['name'][];
  onPayerAdd: (name: string) => void;
  onPayerRemove: (name: string) => void;
  onSubmit: (payers: Props['payers']) => void;
  inputRef?: RefObject<HTMLInputElement>;
};

// - 기존에 추가되어있는 payer가 있을 수도 있고 없을 수도 있다.
// - payer 추가, 삭제를 부모가 알 수 있어야 한다.
const PayerForm = React.memo(
  ({ payers, onPayerAdd, onPayerRemove, inputRef, onSubmit }: Props) => {
    const isHasPreviousPayer = useMemo(() => payers.length > 0, []);
    const [name, setName] = useState<string>('');
    const nameError = useError(PayerD.nameDecode(name));

    const payerError = useError(RoomD.payerDecode(payers));
    const enterToNameAdd = domUtils.onEnter(nameAdd);

    function nameAdd() {
      if (nameError.err) return;
      onPayerAdd(name);
      setName('');
      nameError.hide();
    }

    return (
      <div className="flex flex-col flex-auto justify-between ">
        <div className="flex flex-col flex-auto">
          <ButtonInput
            placeholder="정산할 사람 이름"
            value={name}
            onChange={e => {
              setName(e.target.value);
              nameError.show();
            }}
            isInvalid={nameError.isViewErr}
            onKeyDown={enterToNameAdd}
            button={{
              className: 'min-w-[64px] font-light',
              children: '추가',
              onClick: nameAdd,
              disabled: nameError.isError,
            }}
            onFocus={nameError.hide}
            ref={inputRef}
          />

          <span className="flex text-caption1 font-light mt-4 text-right text-grey300">
            {nameError.render({
              onSuccess: () => null,
              onFailure: error =>
                nameError.isViewErr && (
                  <span className="text-warning">{error.message}</span>
                ),
            })}
            <span
              className={clsx(
                'text-darkgrey100 ml-auto',
                O.isSome(nameError.viewErr) && 'text-warning',
              )}>
              {name.length}
            </span>
            /6
          </span>
          <div id="names-wrap" className="relative flex-auto ">
            <div className="absolute inset-0 mt-16 pb-16 overflow-y-scroll">
              <div className="flex flex-wrap gap-x-8 gap-y-12">
                {payers.map((name, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.28,
                      type: 'spring',
                      bounce: 0.58,
                    }}>
                    <Button
                      theme="chip/lightgrey"
                      className="px-8 py-4"
                      type="button"
                      onClick={e => {
                        onPayerRemove(name);
                      }}>
                      {name}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <footer className="mt-auto mb-16">
          <span className="text-caption1 font-light mb-4 text-grey300">
            <span
              className={clsx(
                'text-darkgrey100',
                O.isSome(payerError.err) && 'error',
              )}>
              {payers.length}명
            </span>
            /10명
          </span>
          <Button
            theme="solid/blue"
            className="w-full"
            onClick={() => onSubmit(payers)}
            disabled={O.isSome(payerError.err)}>
            {isHasPreviousPayer ? '저장하기' : '다음'}
          </Button>
        </footer>
      </div>
    );
  },
);

export default PayerForm;
