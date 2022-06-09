import type { DataFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { useReducer, useRef, useState } from 'react'

import Button from '~/components/ui/Button'
import { useCheckboxState } from '~/hooks/useCheckboxState'
import arrayUtils from '~/utils/arrayUtils'
import { db } from '~/utils/db.server'
import stringUtils from '~/utils/stringUtils'

export function loader({ request }: DataFunctionArgs) {
  return null
}

export async function action({ request }: DataFunctionArgs) {
  console.log('index.tsx', ', request', request)
  const form = await request.formData()
  const userName = form.get('user-name')
  const names = form.get('names')

  console.log('index.tsx', 'userName', userName)
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
  const checks = useCheckboxState([])
  const nameInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex justify-start pt-32 px-20 max-w-[375px] w-full mx-auto h-full max-h-[512px]">
      <Form className="flex flex-col w-full" method="post">
        <div>
          <label className="font-extralight text-title block">누구누구 정산할꺼야?</label>
          <div className="border-1 rounded-8 p-8 border-grey200 py-8 px-16 mt-16">
            <input
              className="placeholder-grey200"
              name="user-name"
              maxLength={10}
              placeholder="정산할 사람 이름"
              ref={nameInputRef}
            />
            <button
              onClick={() => {
                if (nameInputRef.current) {
                  checks.add(nameInputRef.current.value)
                  nameInputRef.current.value = ''
                }
              }}>
              추가
            </button>
          </div>
          <div id="names-wrap" className="flex flex-wrap ">
            {checks.values.map((name, i) => (
              <button
                key={`${name + i}`}
                onClick={() => {
                  checks.remove(name)
                }}>
                {name}
              </button>
            ))}
            <input type="hidden" name="names" value={checks.values.join(',')} />
          </div>
        </div>

        <footer className="mt-auto mb-16">
          <span className="text-caption1 font-light mb-4 text-grey300">
            <span className="text-darkgrey100">{checks.values.length}명</span>/10명
          </span>
          <Button theme="solid_primary400" type="submit">
            다음
          </Button>
        </footer>
      </Form>
    </div>
  )
}
export default Index
