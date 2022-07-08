import { useMotionValue, useSpring } from 'framer-motion';
import type { ComponentPropsWithRef } from 'react';
import { useEffect, useRef } from 'react';

import NumberUtils from '~/utils/numberUtils';

type Props = ComponentPropsWithRef<'span'> & { value: number; comma?: boolean };

function parseValue(value: number, comma?: boolean) {
  return comma ? NumberUtils.thousandsSeparators(value) : value;
}
function AnimatedNumber({ value, comma, children, ...props }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(parseValue(value, comma));
  const springValue = useSpring(motionValue, { duration: 450 });
  console.log('index.tsx', 'motionValue', motionValue);

  useEffect(() => {
    console.log('index.tsx', 'motionValue!', motionValue);
    motionValue.set(value);
  }, [value]);

  useEffect(() => {
    const subscribe = springValue.onChange(latest => {
      const latestNumber = Number(latest);
      if (ref.current) {
        const showValue = latestNumber.toFixed(0);
        ref.current.textContent = comma ? NumberUtils.thousandsSeparators(showValue) : showValue;
      }
    });
    return subscribe;
  }, [springValue]);

  return (
    <span ref={ref} {...props}>
      {children}
    </span>
  );
}
export default AnimatedNumber;
