import type { PayItem } from '@prisma/client'
import type { DataFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useActionData, useFetcher, useLocation, useOutlet, useSearchParams, useSubmit } from '@remix-run/react'
import clsx from 'clsx'
import { isRight } from 'fp-ts/lib/Either'
import { produce } from 'immer'
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useOutletContext } from 'react-router'

import Button from '~/components/ui/Button'
import ButtonInput from '~/components/ui/ButtonInput'
import Drawer from '~/components/ui/Drawer'
import SvgCross from '~/components/ui/Icon/Cross'
import SvgPlus from '~/components/ui/Icon/Plus'
import Input from '~/components/ui/Input'
import { PayItemD } from '~/domain/PayItemD'
import { useSetState } from '~/hooks/useSetState'
import type { Message } from '~/model/Message'
import { isSuccessMessage, message } from '~/model/Message'
import PayerForm from '~/routes/__components/__PayeyForm'
import RoomHeader from '~/routes/__components/__RoomHeader'
import type { OutletContextData } from '~/routes/$roomId'
import pathGenerator from '~/service/pathGenerator'
import { MapValue } from '~/types/utils'
import { db } from '~/utils/db.server'
import domUtils from '~/utils/domUtils'
import numberUtils from '~/utils/numberUtils'
import { getStringFormData } from '~/utils/remixUtils'

export function loader(args: DataFunctionArgs) {
  return null
}

export async function action({ request, params }: DataFunctionArgs) {
  const form = await request.formData()
  const roomId = params.roomId

  console.log('addItem.tsx', 'form', form)

  if (!roomId) throw Error('roomId가 없습니다.')

  switch (form.get('_action')) {
    case 'putPayers': {
      const { names, previousNames } = getStringFormData(form, ['names', 'previousNames'])
      const [nameSet, previousNameSet] = [new Set(names.split(',')), new Set(previousNames.split(','))]
      const addPayers = [...nameSet].filter(name => !previousNameSet.has(name))
      const deletePayers = [...previousNameSet].filter(name => !nameSet.has(name))
      await db.$transaction([
        db.payer.deleteMany({
          where: {
            roomId,
            name: {
              in: deletePayers,
            },
          },
        }),
        db.payer.createMany({ data: addPayers.map(name => ({ roomId, name })) }),
      ])
      return message({
        kind: 'putPayers',
        status: 'success',
        text: '',
      })
    }
    case 'putPayItems': {
      const { payItems, payerId } = getStringFormData(form, ['payItems', 'payerId'])
      const data: PayItemFormValues = JSON.parse(payItems)
      const roomPayItems = await db.room.findUnique({ where: { id: roomId }, include: { payItems: true } })
      if (roomPayItems === null) throw Error('room을 찾을 수 없습니다.')

      const hashedPayItems = new Map(
        roomPayItems.payItems.map(({ id, name, amount }) => [id, [name, amount] as PayItemFormValue]),
      )

      console.log('addItem.tsx', 'data', data)

      const classified = (function () {
        const upsertItems: PayItemFormValues = []
        const deleteIds: Array<PayItem['id']> = []

        console.log('addItem.tsx', 'data2', data)
        for (const datum of data) {
          console.log('addItem.tsx', 'datum', datum)
          const [id, [name, amount]] = datum

          console.log('addItem.tsx', 'id, name, amount', id, name, amount)
          if (isDbId(id) && name === '' && (amount === 0 || Number.isNaN(amount))) {
            deleteIds.push(id)
          } else {
            upsertItems.push(datum)
          }
        }
        return { upsertItems, deleteIds }
      })()

      console.log('addItem.tsx', 'classified', classified)

      await db.$transaction([
        ...classified.upsertItems.map(([id, [name, amount]]) =>
          isDbId(id)
            ? db.payItem.update({
                where: {
                  id,
                },
                data: {
                  name,
                  amount,
                },
              })
            : db.payItem.create({
                data: {
                  name,
                  amount,
                  roomId,
                  payerId: Number(payerId),
                },
              }),
        ),
        db.payItem.deleteMany({
          where: {
            id: {
              in: classified.deleteIds,
            },
          },
        }),
      ])
      return redirect(pathGenerator.room.result({ roomId }))
    }
  }

  return null
}

type UniqueIntegerId = PayItem['id'] | `new_${number}`
type NewItemId = `new_${number}`
const isDbId = (payItemId: UniqueIntegerId): payItemId is PayItem['id'] => typeof payItemId === 'number'

type PayItemFormReducer =
  | {
      type: 'SET' | 'REMOVE'
      value: [UniqueIntegerId, PayItemFormValue]
    }
  | {
      type: 'ADD'
      value: PayItemFormValue
    }
  | {
      type: 'UPDATE_MULTIPLE' | 'INIT'
      value: PayItemFormValues
    }

type PayItemFormValue = [name: string, amount: number]
type PayItemFormValues = Array<[NewItemId, PayItemFormValue | [PayItem['id'], PayItemFormValue]]>
type PayItemFormMap = Map<UniqueIntegerId, PayItemFormValue>
const payItemFormReducer = produce((draft: PayItemFormMap, action: PayItemFormReducer): PayItemFormMap => {
  switch (action.type) {
    case 'SET': {
      const newState = new Map(draft)
      newState.set(action.value[0], action.value[1])
      return newState
    }
    case 'REMOVE': {
      const newState = new Map(draft)
      newState.delete(action.value[0])
      return newState
    }
    case 'ADD': {
      const uniqueIdGenerator = numberUtils.predRandom(n => !draft.has(n))()
      return payItemFormReducer(draft, { type: 'SET', value: [`new_${uniqueIdGenerator()}`, action.value] })
    }

    case 'UPDATE_MULTIPLE': {
      return new Map<UniqueIntegerId, PayItemFormValue>([...draft, ...action.value])
    }

    case 'INIT': {
      return new Map<UniqueIntegerId, PayItemFormValue>([...action.value])
    }

    default:
      return draft
  }
})

export default function addItem() {
  const submit = useSubmit()
  const [searchParams, setSearchParams] = useSearchParams()
  const room = useOutletContext<OutletContextData>()
  const actionData = useActionData<Message>()

  const payerId = searchParams.get('payerId')
  const tempPayers = useSetState(room.payers.map(({ name }) => name))
  const [addPayerMode, _setAddPayerMode] = useState(false)
  const [selectedPayer, setSelectedPayer] = useState(room.payers[0])
  const addPayerInputRef = useRef<HTMLInputElement>(null)
  const [payItemSeparate, setPayItemSeparate] = useState('')

  const [payItems, payItemsDispatcher] = useReducer(payItemFormReducer, new Map<UniqueIntegerId, PayItemFormValue>([]))

  console.log('addItem.tsx', 'payItems', payItems)
  // const [payItems, setPayItems] = useReducer()

  function setAddPayerMode(v: boolean) {
    _setAddPayerMode(v)
    if (v) requestAnimationFrame(() => addPayerInputRef.current?.focus())
  }

  function handleAddPayerClose() {
    setAddPayerMode(false)
    tempPayers.reset()
  }

  // 저장
  function handlePayItemSubmit() {
    const formData = new FormData()
    formData.set('_action', 'putPayItems')
    formData.set('payItems', JSON.stringify([...payItems.entries()]))
    formData.set('payerId', `${selectedPayer.id}`)

    console.log('addItem.tsx', 'formData', [...formData])
    submit(formData, { method: 'put' })
    console.log('addItem.tsx', 'success submit')
  }

  function handlePayerSubmit() {
    const formData = new FormData()
    formData.set('_action', 'putPayers')
    formData.set('previousNames', payerNames.join(','))
    formData.set('names', tempPayers.values.join(','))
    submit(formData, { method: 'put' })
    setAddPayerMode(false)
  }

  useEffect(() => {
    if (!actionData || !room) return
    switch (actionData.kind) {
      case 'putPayers': {
        // 기존에 선택되어있던 payer을 삭제한 경우 다시 payers[0]을 선택
        if (isSuccessMessage(actionData) && !room.payers.some(payer => payer.name === selectedPayer.name)) {
          setSelectedPayer(room.payers[0])
        }
      }
    }
  }, [room])

  // PayerId가 없을시 세팅해줌.
  useEffect(() => {
    if (!payerId) setSearchParams({ payerId: `${room.payers[0].id}` }, { replace: true })
  }, [payerId])

  const handlePayItemAdd = () => {
    const result = PayItemD.utils.payStrSeparator(payItemSeparate)
    if (isRight(result)) {
      payItemsDispatcher({ type: 'ADD', value: [result.right.name, result.right.amount] })
      setPayItemSeparate('')
      addPayerInputRef.current?.focus()
    }
  }

  const handleEnter = domUtils.onEnter(handlePayItemAdd)

  return (
    <>
      <RoomHeader
        room={room}
        Right={({ room }) => (
          <Button className="w-44 h-44 underline text-primary400" onClick={handlePayItemSubmit}>
            저장
          </Button>
        )}
      />
      <nav className="min-h-56 overflow-x-scroll">
        <div className="flex gap-x-8 nav-contents pl-20">
          <Button theme="ghost/lightblue" className="w-48" onClick={() => setAddPayerMode(true)}>
            <SvgPlus className="stroke-primary300" />
          </Button>
          {room.payers.map(payer => {
            const isSelected = payer.id === Number(searchParams.get('payerId'))
            return (
              <Button
                key={payer.id}
                theme={isSelected ? 'chip/blue' : 'chip/lightgrey'}
                className={clsx(isSelected && 'font-semibold', 'px-8')}
                onClick={() => setSearchParams({ payerId: `${payer.id}` })}
                hasClose={false}>
                {payer.name}
              </Button>
            )
          })}
        </div>
      </nav>

      <div className="relative flex flex-col flex-auto">
        <div className="empty-pay-items flex flex-col flex-auto items-center justify-center">
          <img className="w-[205px] h-[178px]" src="/images/main_illustrate.svg" alt="main_illustrate" />
          <p className="mt-16">등록한 내역이 없어!</p>
          <Button className="mt-48 min-w-[112px]" theme="solid/subOrange">
            <SvgPlus className="stroke-white"></SvgPlus>내역 추가
          </Button>
        </div>
        <div className="absolute flex flex-col justify-between inset-0 bg-white">
          <div className="w-full">
            {[...payItems.entries()].map(([id, [name, amount]]) => {
              return (
                <div key={id} className="flex gap-x-24 px-20 py-12">
                  <Input
                    key={`${id}-name`}
                    defaultValue={name}
                    name="item-name"
                    wrapClassName="basis-[176px]"
                    type="text"
                    placeholder="사용처"
                    onBlur={e => {
                      payItems.set(id, [e.target.value, amount])
                    }}
                    hasUnderline></Input>
                  <Input
                    key={`${id}-amount`}
                    defaultValue={amount}
                    name="item-amount"
                    wrapClassName="basis-[135px]"
                    placeholder="사용처"
                    type="money"
                    onBlur={e => {
                      payItems.set(id, [name, Number(e.target.value)])
                    }}
                    hasUnderline></Input>
                </div>
              )
            })}
          </div>
          <div className="flex flex-col shadow-100 px-20 py-12 bg-white">
            <p className="text-caption1 text-darkgrey100 mb-4 font-light">금액/사용처 예) 택시/12,000</p>
            <ButtonInput
              button={{ children: '추가', className: 'min-w-64', onClick: handlePayItemAdd }}
              value={payItemSeparate}
              onChange={e => setPayItemSeparate(e.target.value)}
              onKeyDown={handleEnter}
              ref={addPayerInputRef}
            />
          </div>
        </div>
      </div>

      <Drawer open={addPayerMode} placement="bottom" onClose={handleAddPayerClose}>
        <div className="flex flex-col h-[90vh] w-[100vw] rounded-t-[24px] py-[18px] px-[20px] max-h-[476px]">
          <header className="drawer-head mb-8">
            <Button className="w-[28px] h-[28px] px-0" onClick={handleAddPayerClose}>
              <SvgCross width={28} height={28} />
            </Button>
          </header>
          <PayerForm
            payers={tempPayers.values}
            onPayerAdd={tempPayers.add}
            onPayerRemove={tempPayers.remove}
            onSubmit={handlePayerSubmit}
            inputRef={addPayerInputRef}
          />
        </div>
      </Drawer>
    </>
  )
}
