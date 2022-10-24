import * as React from 'react';
import type { SVGProps } from 'react';

const SvgCheckCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}>
    <path
      d="M12 21.143a9.143 9.143 0 1 0 0-18.286 9.143 9.143 0 0 0 0 18.286Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m8.571 13.143 2.286 2.285 5.714-5.714"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgCheckCircle;
