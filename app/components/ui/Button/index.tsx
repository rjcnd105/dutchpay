import clsx from 'clsx';
import type { ComponentPropsWithRef } from 'react';

import { CrossCircle } from '../Icon';

type Kind = 'solid' | 'ghost' | 'chip' | 'text';
type Theme =
  | 'solid/blue'
  | 'solid/subOrange'
  | 'solid/darkgrey'
  | 'solid/white'
  | 'solid/warning'
  | 'text'
  | 'ghost/blue'
  | 'ghost/lightblue'
  | 'chip/white'
  | 'chip/lightblue'
  | 'chip/blue'
  | 'chip/lightgrey';

type Size = 'md' | 'sm';
type Props = ComponentPropsWithRef<'button'> & {
  theme?: Theme;
  size?: 'md' | 'sm';
  hasClose?: boolean;
  clickable?: boolean;
  isLoading?: boolean;
};

const sizeObj: Record<Size, string> = {
  md: 'min-h-48 rounded-8',
  sm: 'min-h-32 rounded-4',
} as const;

const Button = ({
  theme = 'text',
  size = 'md',
  className,
  children,
  hasClose = theme?.includes('chip'),
  clickable = true,
  isLoading = false,
  ...props
}: Props) => {
  const themes = theme?.split('/') as [Kind, string | undefined];
  return (
    <button
      className={clsx(
        'ui_Button',
        themes,
        sizeObj[size],
        !clickable && 'none-clickable',
        className,
      )}
      type="button"
      {...props}>
      {isLoading ? <span>loading</span> : children}
      {hasClose && (
        <CrossCircle className="fill-grey200 ml-8" width={14} height={14} />
      )}
    </button>
  );
};
export default Button;
