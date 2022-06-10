import type { DataFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useSubmit } from '@remix-run/react'
import type { KeyboardEventHandler } from 'react'
import { useCallback, useReducer, useRef, useState } from 'react'

import Button from '~/components/ui/Button'
import ButtonInput from '~/components/ui/ButtonInput'
import { CrossCircle } from '~/components/ui/Icon'
import { useCheckboxState } from '~/hooks/useCheckboxState'
import arrayUtils from '~/utils/arrayUtils'
import { db } from '~/utils/db.server'
import domUtils from '~/utils/domUtils'
import stringUtils from '~/utils/stringUtils'

export function loader({ request }: DataFunctionArgs) {
  return null
}

export async function action({ request }: DataFunctionArgs) {
  console.log('index.tsx', ', request', request)
  const form = await request.formData()
  const names = form.get('names')

  console.log('index.tsx', 'names', names)

  if (!stringUtils.isNotEmptyStr(names))
    return {
      type: 'error',
      message: '이름이 입력되지 않았음',
    }

  const room = await db.room.create({ data: { name: '정산' } })
  return redirect(`/${room.id}`)
}

const Index = () => {
  const submit = useSubmit()
  const checks = useCheckboxState([])
  const [name, setName] = useState<string>('')

  const nameAdd = () => {
    if (name.length > 0) {
      checks.add(name)
      setName('')
    }
  }
  const enterToNameAdd = domUtils.onEnter(nameAdd)

  const handleSubmit = () => {
    const formData = new FormData()
    formData.set('names', checks.values.join(','))
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
            onKeyDown={enterToNameAdd}
            onChange={e => {
              setName(e.target.value)
            }}
            button={{ className: 'w-[64px] font-light', children: '추가', onClick: nameAdd }}
          />

          <span className="block text-caption1 font-light mt-4 text-right text-grey300">
            <span className="text-darkgrey100">{name.length}</span>/6
          </span>
          <div id="names-wrap" className="flex flex-wrap ">
            {checks.values.map((name, i) => (
              <Button
                theme="chip/lightgrey"
                key={`${name + i}`}
                type="button"
                onClick={e => {
                  checks.remove(name)
                }}>
                {name}
              </Button>
            ))}
          </div>
        </div>

        <footer className="mt-auto mb-16">
          <span className="text-caption1 font-light mb-4 text-grey300">
            <span className="text-darkgrey100">{checks.values.length}명</span>/10명
          </span>
          <Button theme="solid/blue" onClick={handleSubmit}>
            다음
          </Button>
        </footer>
      </div>
    </div>
  )
}
export default Index
