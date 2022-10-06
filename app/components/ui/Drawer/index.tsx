import RcDrawer from 'rc-drawer';
import type { IPlacement } from 'rc-drawer/lib/IDrawerPropTypes';
import type { ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  placement: IPlacement;
};
const Drawer = ({ open, onClose, placement, children }: Props) => {
  return (
    <RcDrawer
      open={open}
      placement={placement}
      onClose={onClose}
      handler={null}
      level={null}>
      {children}
    </RcDrawer>
  );
};
export default Drawer;
