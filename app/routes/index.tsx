import type { DataFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { useReducer, useRef, useState } from 'react'

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
  console.log('index.tsx', 'form', [...form])

  if (!stringUtils.isNotEmptyStr(names))
    return {
      type: 'error',
      message: '이름이 입력되지 않았음',
    }

  const room = await db.room.create({ data: { name: '정산' } })
  console.log('index.tsx', 'room', room)
  return redirect(`/${room.id}`)
}

type NameReducerActions = {
  type: 'ADD' | 'REMOVE'
  name: string
}
const nameRemover = arrayUtils.matchRemove<string>()
function nameReducer(state: string[], action: NameReducerActions) {
  switch (action.type) {
    case 'ADD':
      state.push(action.name)
      return state

    case 'REMOVE':
      return nameRemover(state, action.name)

    default:
      return state
  }
}

const Index = () => {
  const [names, dispatch] = useReducer(nameReducer, [])
  const nameInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex justify-start items-center pt-20 h-screen w-screen flex-col text-center">
      <Form method="post" replace>
        <div>
          <label>누구누구 정산할꺼야?</label>
          <input name="user-name" placeholder="정산할 사람 이름" ref={nameInputRef} />
          <button
            onClick={() => {
              if (nameInputRef.current) {
                dispatch({ type: 'ADD', name: nameInputRef.current.value })
                nameInputRef.current.value = ''
              }
            }}>
            추가
          </button>
        </div>

        <div id="names-wrap" className="flex flex-wrap ">
          {names.map((name, i) => (
            <button
              key={`${name + i}`}
              onClick={() => {
                dispatch({ type: 'REMOVE', name })
              }}>
              {name}
            </button>
          ))}
          <input type="hidden" name="names" value={names.join(',')} />
        </div>

        <footer>
          <span className="">n명</span>
          <button type="submit">다음</button>
        </footer>
      </Form>
    </div>
  )
}
export default Index
