import { LinksFunction } from '@remix-run/react/routeModules'
import clsx from 'clsx'
import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from 'react'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'

import { CrossCircle } from '~/components/ui/Icon'
import domUtils from '~/utils/domUtils'

type Props = ComponentPropsWithRef<'input'> & { hasClear: boolean }

const Input = forwardRef<HTMLInputElement, Props>(({ hasClear = true, className, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  const onClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      domUtils.inputChangeTrigger(inputRef.current, '')
    }
  }, [])

  return (
    <>
      <input className={clsx('ui_input', className)} ref={inputRef} {...props} required />
      {hasClear && (
        <div className="input-clear">
          <button onClick={onClear}>
            <CrossCircle className="fill-grey300" width={14} height={14} />
          </button>
        </div>
      )}
    </>
  )
})

Input.displayName = 'Input'

export default Input
