import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import css from './BgIcon.css';

export const iconNames = [
  'arrow_left',
  'arrow_right',
  'arrow_down',
  'arrow_up',
  'calendar',
  'card',
  'check_circle3',
  'check_circle_filled',
  'close',
  'coin',
  'coins',
  'copy',
  'create',
  'cross',
  'cross_circle',
  'frame',
  'external',
  'message',
  'pen',
  'plus',
  'plus_square',
  'receipt',
  'share2',
  'share1',
  'trash',
] as const;

export type IconProps = ComponentPropsWithoutRef<'div'> & {
  name: keyof typeof icons;
  size?: 'bg' | 'md' | 'sm' | 'xs' | 'xxs';
};

export const icons = Object.fromEntries(
  iconNames.map(name => [name, `/icons/${name}.svg`]),
) as Record<(typeof iconNames)[number], string>;

const Icon = ({ className, name, size = 'md', ...props }: IconProps) => (
  <div
    className={clsx(`ui_bg-icon icon-size-${size}`, className)}
    style={{ backgroundImage: `url("${icons[name]}")` }}
    {...props}
  />
);

export default Icon;
