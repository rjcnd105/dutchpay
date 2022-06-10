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
  return (
    <div className={clsx('ui_ButtonInput', isInvalid && '!border-warning')}>
      <Input {...props} ref={ref} borderNone />
      <Button theme="solid/darkgrey" size="sm" {...button} />
    </div>
  )
})

ButtonInput.displayName = 'Input'

export default ButtonInput
