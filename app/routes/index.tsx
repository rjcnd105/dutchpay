import type { DataFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useSubmit } from '@remix-run/react'
import clsx from 'clsx'
import { isRight } from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import { motion } from 'framer-motion'
import type { KeyboardEventHandler } from 'react'
import { useCallback, useMemo, useReducer, useRef, useState } from 'react'

import Button from '~/components/ui/Button'
import ButtonInput from '~/components/ui/ButtonInput'
import { CrossCircle } from '~/components/ui/Icon'
import { PayerD } from '~/domain/PayerD'
import { RoomD } from '~/domain/RoomD'
import { useCheckboxState } from '~/hooks/useCheckboxState'
import useError from '~/hooks/useError'
import arrayUtils from '~/utils/arrayUtils'
import { db } from '~/utils/db.server'
import domUtils from '~/utils/domUtils'
import stringUtils from '~/utils/stringUtils'
import { foldValidatorS } from '~/utils/validation'

export function loader({ request }: DataFunctionArgs) {
  return null
}

export async function action({ request }: DataFunctionArgs) {
  const form = await request.formData()
  const names = form.get('names')

  if (!stringUtils.isNotEmptyStr(names))
    return {
      type: 'error',
      message: '이름이 입력되지 않았음',
    }

  const payerNames = names.split(',')

  const room = await db.$transaction(async prisma => {
    const room = await db.room.create({
      data: { name: '정산' },
    })

    await db.payer.createMany({
      data: payerNames.map(payerName => ({
        name: payerName,
        roomId: room.id,
      })),
    })

    return room
  })

  return redirect(`/${room.id}`)
}

const Index = () => {
  const submit = useSubmit()
  const [name, setName] = useState<string>('')
  const payers = useCheckboxState([])
  const nameError = useError(PayerD.validator.name(name))
  const payerError = useError(RoomD.validator.payers(payers.values))

  const nameAdd = () => {
    if (nameError.error) return
    payers.add(name)
    setName('')
    nameError.hiddenError()
  }
  const enterToNameAdd = domUtils.onEnter(nameAdd)

  const handleSubmit = () => {
    const formData = new FormData()
    formData.set('names', payers.values.join(','))
    submit(formData, { method: 'delete' })
  }

  return (
    <div className="flex justify-start pt-32 px-20 max-w-[375px] w-full mx-auto h-full max-h-[512px]">
      <div className="flex flex-col w-full">
        <label className="font-extralight text-title block mb-16">누구누구 정산할꺼야?</label>
        <div className="flex flex-col">
          <ButtonInput
            placeholder="정산할 사람 이름"
            value={name}
            onChange={e => {
              setName(e.target.value)
              nameError.showError()
            }}
            onKeyDown={enterToNameAdd}
            button={{
              className: 'w-[64px] font-light',
              children: '추가',
              onClick: nameAdd,
              disabled: !!nameError.error,
            }}
            onFocus={nameError.hiddenError}
          />

          <span className="flex text-caption1 font-light mt-4 text-right text-grey300">
            {nameError.viewError && <span className="error">{nameError.viewError.message}</span>}
            <span className={clsx('text-darkgrey100 ml-auto', nameError.viewError && 'error')}>{name.length}</span>
            /6
          </span>
          <div id="names-wrap" className="flex flex-wrap mt-16 gap-x-8 gap-y-12 pb-16">
            {payers.values.map((name, i) => (
              <motion.div
                key={`${name + i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, type: 'spring', bounce: 0.58 }}>
                <Button
                  theme="chip/lightgrey"
                  type="button"
                  onClick={e => {
                    payers.remove(name)
                  }}>
                  {name}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        <footer className="mt-auto mb-16">
          <span className="text-caption1 font-light mb-4 text-grey300">
            <span className={clsx('text-darkgrey100', payerError.error && 'error')}>{payers.values.length}명</span>
            /10명
          </span>
          <Button theme="solid/blue" onClick={handleSubmit} disabled={!!payerError.error}>
            다음
          </Button>
        </footer>
      </div>
    </div>
  )
}
export default Index
