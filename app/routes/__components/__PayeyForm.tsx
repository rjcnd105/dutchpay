import type { Payer } from '@prisma/client'
import type { DataFunctionArgs } from '@remix-run/node'
import clsx from 'clsx'
import { copy } from 'fp-ts/lib/Array'
import { motion } from 'framer-motion'
import type { MutableRefObject, RefObject } from 'react'
import { Ref, useRef, useState } from 'react'

import Button from '~/components/ui/Button'
import ButtonInput from '~/components/ui/ButtonInput'
import { PayerD } from '~/domain/PayerD'
import { RoomD } from '~/domain/RoomD'
import useError from '~/hooks/useError'
import domUtils from '~/utils/domUtils'

type Props = {
  payers: Payer['name'][]
  onPayerAdd: (name: string) => void
  onPayerRemove: (name: string) => void
  onSubmit: (payers: Props['payers']) => void
  inputRef?: RefObject<HTMLInputElement>
}

// - 기존에 추가되어있는 payer가 있을 수도 있고 없을 수도 있다.
// - payer 추가, 삭제를 부모가 알 수 있어야 한다.
export default function PayerForm({ payers, onPayerAdd, onPayerRemove, inputRef, onSubmit }: Props) {
  const [name, setName] = useState<string>('')
  const nameError = useError(PayerD.validator.name(name))

  function nameAdd() {
    if (nameError.error) return
    onPayerAdd(name)
    setName('')
    nameError.hiddenError()
  }
  const enterToNameAdd = domUtils.onEnter(nameAdd)
  const payerError = useError(RoomD.validator.payers(payers))

  return (
    <div className="flex flex-col flex-auto justify-between">
      <div className="flex flex-col flex-auto">
        <ButtonInput
          placeholder="정산할 사람 이름"
          value={name}
          onChange={e => {
            setName(e.target.value)
            nameError.showError()
          }}
          isInvalid={!!nameError.viewError}
          onKeyDown={enterToNameAdd}
          button={{
            className: 'min-w-[64px] font-light',
            children: '추가',
            onClick: nameAdd,
            disabled: !!nameError.error,
          }}
          onFocus={nameError.hiddenError}
          ref={inputRef}
        />

        <span className="flex text-caption1 font-light mt-4 text-right text-grey300">
          {nameError.viewError && <span className="error">{nameError.viewError.message}</span>}
          <span className={clsx('text-darkgrey100 ml-auto', nameError.viewError && 'error')}>{name.length}</span>
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
                  transition={{ duration: 0.28, type: 'spring', bounce: 0.58 }}>
                  <Button
                    theme="chip/lightgrey"
                    className="px-8 py-4"
                    type="button"
                    onClick={e => {
                      onPayerRemove(name)
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
          <span className={clsx('text-darkgrey100', payerError.error && 'error')}>{payers.values.length}명</span>
          /10명
        </span>
        <Button theme="solid/blue" className="w-full" onClick={() => onSubmit(payers)} disabled={!!payerError.error}>
          다음
        </Button>
      </footer>
    </div>
  )
}
