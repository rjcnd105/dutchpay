import { LinksFunction } from '@remix-run/react/routeModules'
import clsx from 'clsx'
import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ReactNode } from 'react'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'

import { CrossCircle } from '~/components/ui/Icon'
import domUtils from '~/utils/domUtils'

import Button from '../Button'
import Input from '../Input'

type Props = ComponentPropsWithRef<'input'> & { button: ComponentPropsWithoutRef<'button'> } & {
  isInvalid?: boolean
}

const ButtonInput = forwardRef<HTMLInputElement, Props>(({ button, isInvalid, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  const onClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      domUtils.inputChangeTrigger(inputRef.current, '')
    }
  }, [])

  return (
    <div className={clsx('ui_ButtonInput', isInvalid && '!border-warning')}>
      <Input {...props} ref={inputRef} />
      <Button theme="solid/darkgrey" size="sm" onClick={onClear} {...button} />
    </div>
  )
})

ButtonInput.displayName = 'Input'

export default ButtonInput
