import type { DataFunctionArgs } from '@remix-run/node'
import { useActionData, useOutlet, useSubmit } from '@remix-run/react'
import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useOutletContext } from 'react-router'

import Button from '~/components/ui/Button'
import ButtonInput from '~/components/ui/ButtonInput'
import Drawer from '~/components/ui/Drawer'
import SvgCross from '~/components/ui/Icon/Cross'
import SvgPlus from '~/components/ui/Icon/Plus'
import Input from '~/components/ui/Input'
import { useCheckboxState } from '~/hooks/useCheckboxState'
import type { Message } from '~/model/Message'
import { isSuccessMessage, message } from '~/model/Message'
import PayerForm from '~/routes/__components/__PayeyForm'
import type { OutletContextData } from '~/routes/$roomId'
import { db } from '~/utils/db.server'
import { getStringFormData } from '~/utils/remixUtils'

export function loader(args: DataFunctionArgs) {
  return null
}

export async function action({ request, params }: DataFunctionArgs) {
  const form = await request.formData()
  const roomId = params.roomId

  if (!roomId) throw Error('roomId가 없습니다.')

  switch (form.get('_action')) {
    case 'pullPayer': {
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
        kind: 'pullPayer',
        status: 'success',
        text: '',
      })
    }
  }

  return null
}

export default function addItem() {
  const submit = useSubmit()
  const room = useOutletContext<OutletContextData>()
  const actionData = useActionData<Message>()
  const payerNames = useMemo(() => room.payers.map(({ name }) => name), [room])
  const tempPayers = useCheckboxState(payerNames)
  const [addPayerMode, _setAddPayerMode] = useState(false)
  const [selectedPayer, setSelectedPayer] = useState(room.payers[0])
  const addPayerInputRef = useRef<HTMLInputElement>(null)

  function setAddPayerMode(v: boolean) {
    _setAddPayerMode(v)
    if (v) requestAnimationFrame(() => addPayerInputRef.current?.focus())
  }

  function handleAddPayerClose() {
    setAddPayerMode(false)
    tempPayers.reset()
  }

  function handlePayerSubmit() {
    const formData = new FormData()
    formData.set('_action', 'pullPayer')
    formData.set('previousNames', payerNames.join(','))
    formData.set('names', tempPayers.values.join(','))
    submit(formData, { method: 'put' })
    setAddPayerMode(false)
  }

  useEffect(() => {
    if (!actionData || !room) return
    switch (actionData.kind) {
      case 'pullPayer': {
        // 기존에 선택되어있던 payer을 삭제한 경우 다시 payers[0]을 선택
        if (isSuccessMessage(actionData) && !room.payers.some(payer => payer.name === selectedPayer.name)) {
          setSelectedPayer(room.payers[0])
        }
      }
    }
  }, [room])

  return (
    <>
      <nav className="min-h-56 overflow-x-scroll">
        <div className="flex gap-x-8 nav-contents pl-20">
          <Button theme="ghost/lightblue" className="w-48" onClick={() => setAddPayerMode(true)}>
            <SvgPlus className="stroke-primary300" />
          </Button>
          {room.payers.map(payer => {
            const isSelected = payer.id === selectedPayer.id
            return (
              <Button
                key={payer.id}
                theme={isSelected ? 'chip/blue' : 'chip/lightgrey'}
                className={clsx(isSelected && 'font-semibold', 'px-8')}
                onClick={() => setSelectedPayer(payer)}
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
          <div className="flex gap-x-24 px-20 py-12 ">
            <Input className="basis-[176px]" type="text" hasUnderline></Input>
            <Input className="basis-[135px]" type="number" hasUnderline></Input>
          </div>
          <div className="flex flex-col shadow-100 px-20 py-12 bg-white">
            <p className="text-caption1 text-darkgrey100 mb-4 font-light">금액/사용처 예) 택시/12,000</p>
            <ButtonInput button={{ children: '추가', className: 'min-w-64' }} />
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
