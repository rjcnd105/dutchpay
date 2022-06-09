import type { LinksFunction } from '@remix-run/react/routeModules'
import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'

import css from './Button.css'

type Theme =
  | 'solid_primary400'
  | 'solid_subOrange'
  | 'solid_darkgrey'
  | 'textButton'
  | 'ghost_blue'
  | 'ghost_white'
  | 'chip_white'
  | 'chip_blue'
type Props = ComponentPropsWithoutRef<'button'> & {
  theme?: Theme
}

const Button = ({ theme = 'textButton', ...props }: Props) => (
  <div className={clsx('ui_Button', 'relative', theme)}>
    <button {...props}></button>
  </div>
)
export default Button
