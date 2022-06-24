import type DrawerWrapper from 'rc-drawer'
import RcDrawer from 'rc-drawer'
import type { IPlacement } from 'rc-drawer/lib/IDrawerPropTypes'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

type Props = {
  open: boolean
  onClose?: () => void
  children: ReactNode
  placement: IPlacement
}
const Drawer = ({ open, onClose, placement, children }: Props) => {
  const ref = useRef<DrawerWrapper>(null)

  useEffect(() => {
    console.log('index.tsx', 'ref.current', ref.current)
  }, [ref])

  return (
    <RcDrawer open={open} placement={placement} onClose={onClose} handler={null} level={null} ref={ref}>
      {children}
    </RcDrawer>
  )
}
export default Drawer
