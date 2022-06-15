import { ErrorMessage } from '@hookform/error-message'
import type { DataFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useSubmit } from '@remix-run/react'
import clsx from 'clsx'
import { isRight } from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import type { KeyboardEventHandler } from 'react'
import { useCallback, useMemo, useReducer, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import Button from '~/components/ui/Button'
import ButtonInput from '~/components/ui/ButtonInput'
import { CrossCircle } from '~/components/ui/Icon'
import { Payer } from '~/domain/Payer'
import { Room } from '~/domain/Room'
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

  const room = await db.room.create({ data: { name: '정산' } })
  return redirect(`/${room.id}`)
}

const defaultNameField = {
  name: '',
}

const Index = () => {
  const submit = useSubmit()
  const [name, setName] = useState<string>('')
  const payers = useCheckboxState([])
  const nameError = useError(Payer.validator.name(name))
  const payerError = useError(Room.validator.payers(payers.values))

  const nameAdd = () => {
    if (!nameError.error) {
      payers.add(name)
      setName('')
    } else {
      nameError.showError()
    }
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
              nameError.hiddenError()
            }}
            onKeyDown={enterToNameAdd}
            button={{
              className: 'w-[64px] font-light',
              children: '추가',
              onClick: nameAdd,
            }}
            onFocus={nameError.hiddenError}
          />

          <span className="flex text-caption1 font-light mt-4 text-right text-grey300">
            {nameError.viewError && <span className="error">{nameError.viewError.message}</span>}
            <span className={clsx('text-darkgrey100 ml-auto', nameError.viewError && 'error')}>{name.length}</span>
            /6
          </span>
          <div id="names-wrap" className="flex flex-wrap mt-16 gap-x-8 gap-y-12">
            {payers.values.map((name, i) => (
              <Button
                theme="chip/lightgrey"
                key={`${name + i}`}
                type="button"
                onClick={e => {
                  payers.remove(name)
                }}>
                {name}
              </Button>
            ))}
          </div>
        </div>

        <footer className="mt-auto mb-16">
          <span className="text-caption1 font-light mb-4 text-grey300">
            <span className={clsx('text-darkgrey100', payerError.error && 'error')}>{payers.values.length}명</span>/10명
          </span>
          <Button
            theme="solid/blue"
            onClick={handleSubmit}
            disabled={[...Object.values(Room.validator.payers)].some(fn => !fn(payers.values))}>
            다음
          </Button>
        </footer>
      </div>
    </div>
  )
}
export default Index
