import type { ComponentPropsWithoutRef } from 'react'

import Button from '~/components/ui/Button'
import ButtonInput from '~/components/ui/ButtonInput'
import Input from '~/components/ui/Input'

const buttonThemes = [
  'solid/blue',
  'solid/subOrange',
  'solid/darkgrey',
  'text',
  'ghost/blue',
  'ghost/lightblue',
  'chip/white',
  'chip/lightblue',
  'chip/blue',
  'chip/lightgrey',
] as const

const CompHead = (p: ComponentPropsWithoutRef<'h3'>) => <h3 className="text-white text-title mt-24 mb-12" {...p} />
const components = () => {
  return (
    <div className="bg-darkgrey200 p-16">
      <h1 className="text-white text-heading mb-16">Components</h1>

      <CompHead>Button</CompHead>
      <div className="grid grid-cols-5">
        {buttonThemes.map(v => (
          <Button theme={v}>{v}</Button>
        ))}
        <Button theme="solid/blue" size="sm">
          sm
        </Button>
      </div>

      <CompHead>Input, ButtonInput</CompHead>
      <div className="w-[240px] p-16 bg-white">
        <Input></Input>
        <div className="p-16"></div>
        <ButtonInput button={{ children: '추가' }}></ButtonInput>
        <ButtonInput isInvalid button={{ children: '추가' }}></ButtonInput>
      </div>
    </div>
  )
}
export default components
