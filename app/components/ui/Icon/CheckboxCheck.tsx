import * as React from 'react';
import { SVGProps } from 'react';
const SvgCheckboxCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}>
    <path d="m6 13.1 3.4 3.4L17.9 8" />
  </svg>
);
export default SvgCheckboxCheck;
