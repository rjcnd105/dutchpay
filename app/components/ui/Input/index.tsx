import { LinksFunction } from '@remix-run/react/routeModules'
import clsx from 'clsx'
import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from 'react'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'

import { CrossCircle } from '~/components/ui/Icon'
import domUtils from '~/utils/domUtils'

type Props = ComponentPropsWithRef<'input'> & { hasClear?: boolean; hasUnderline?: boolean }

const Input = forwardRef<HTMLInputElement, Props>(
  ({ hasUnderline = false, hasClear = true, className, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const onClear = useCallback(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        domUtils.inputChangeTrigger(inputRef.current, '')
      }
    }, [])

    return (
      <div
        className={clsx(
          'relative flex flex-auto items-center',
          hasUnderline && 'border-b-1 border-b-grey200',
          className,
        )}>
        <input className={clsx('ui_input', hasClear && 'pr-32')} ref={inputRef} {...props} required />
        {hasClear && (
          <button
            className="absolute flex right-0 top-1/2 -translate-y-1/2 items-center justify-end w-32 h-32"
            onClick={onClear}>
            <CrossCircle className="fill-grey300" width={14} height={14} />
          </button>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
