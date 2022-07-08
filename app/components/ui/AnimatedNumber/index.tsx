import { useMotionValue, useSpring } from 'framer-motion';
import type { ComponentPropsWithRef } from 'react';
import { useEffect, useRef } from 'react';

import NumberUtils from '~/utils/numberUtils';

type Props = ComponentPropsWithRef<'span'> & { value: number | string; comma?: boolean };

function AnimatedNumber({ value, comma, children, ...props }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 500 });

  useEffect(() => {
    motionValue.set(typeof value === 'number' ? value : Number(value));
  }, [motionValue, value]);

  useEffect(
    () =>
      springValue.onChange(latest => {
        if (ref.current) {
          const showValue = latest.toFixed(0);
          ref.current.textContent = comma ? NumberUtils.thousandsSeparators(showValue) : showValue;
        }
      }),
    [springValue],
  );

  return (
    <span ref={ref} {...props}>
      {children}
    </span>
  );
}
export default AnimatedNumber;
