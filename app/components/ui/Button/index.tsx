import type { LinksFunction } from '@remix-run/react/routeModules'
import clsx from 'clsx'
import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from 'react'

import { CrossCircle } from '../Icon'
import css from './Button.css'

type Kind = 'solid' | 'ghost' | 'chip' | 'text'
type Theme =
  | 'solid/blue'
  | 'solid/subOrange'
  | 'solid/darkgrey'
  | 'text'
  | 'ghost/blue'
  | 'ghost/lightblue'
  | 'chip/white'
  | 'chip/lightblue'
  | 'chip/blue'
  | 'chip/lightgrey'

type Size = 'md' | 'sm'
type Props = ComponentPropsWithRef<'button'> & {
  theme?: Theme
  size?: 'md' | 'sm'
  hasClose?: boolean
}

const sizeObj: Record<Size, string> = {
  md: 'h-48 rounded-8',
  sm: 'h-32 text-caption1 rounded-4',
} as const

const Button = ({
  theme = 'text',
  size = 'md',
  className,
  children,
  hasClose = theme?.includes('chip'),
  ...props
}: Props) => {
  const [t1, t2] = theme?.split('/') as [Kind, string]
  return (
    <div className={clsx('ui_Button', 'flex items-center', t2 ? [t1, t2] : t1, sizeObj[size], className)}>
      <button {...props}>
        {children}
        {hasClose && <CrossCircle className="fill-grey200 ml-8" width={14} height={14} />}
      </button>
    </div>
  )
}
export default Button
