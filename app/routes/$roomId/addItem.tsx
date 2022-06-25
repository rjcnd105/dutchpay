import type { DataFunctionArgs } from '@remix-run/node'
import { useOutlet } from '@remix-run/react'
import clsx from 'clsx'
import { useState } from 'react'
import { useOutletContext } from 'react-router'

import Button from '~/components/ui/Button'
import Drawer from '~/components/ui/Drawer'
import SvgCross from '~/components/ui/Icon/Cross'
import SvgPlus from '~/components/ui/Icon/Plus'
import type { OutletContextData } from '~/routes/$roomId'

export const loader = (args: DataFunctionArgs) => {
  return null
}

export default function addItem() {
  const room = useOutletContext<OutletContextData>()
  const [addPayerMode, setAddPayerMode] = useState(false)
  const [selectedPayer, setSelectedPayer] = useState(room.payers[0])

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

      <div className="flex flex-col flex-auto">
        <div className="empty-pay-items flex flex-col flex-auto items-center justify-center">
          <img className="w-[205px] h-[178px]" src="/images/main_illustrate.svg" alt="main_illustrate" />
          <p className="mt-16">등록한 내역이 없어!</p>
          <Button className="mt-48 min-w-[112px]" theme="solid/subOrange">
            <SvgPlus className="stroke-white"></SvgPlus>내역 추가
          </Button>
        </div>
      </div>

      <Drawer open={addPayerMode} placement="bottom" onClose={() => setAddPayerMode(false)}>
        <div className="h-[80vh] w-[100vw] rounded-t-[24px] py-[18px] px-[20px]">
          <header className="drawer-head">
            <Button className="w-[28px] h-[28px] px-0" onClick={() => setAddPayerMode(false)}>
              <SvgCross width={28} height={28} />
            </Button>
          </header>
          <div></div>
        </div>
      </Drawer>
    </>
  )
}
