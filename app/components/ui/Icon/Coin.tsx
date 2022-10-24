import * as React from 'react';
import { SVGProps } from 'react';
const SvgCoin = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}>
    <path
      clipRule="evenodd"
      d="M4 10.857C4 9.372 7.582 7.43 12 7.43s8 1.943 8 3.428v3.429c0 1.485-3.582 3.428-8 3.428s-8-1.943-8-3.428v-3.429Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      clipRule="evenodd"
      d="M12 14.267c4.418 0 8-1.835 8-3.412 0-1.578-3.582-3.426-8-3.426s-8 1.848-8 3.425c0 1.579 3.582 3.413 8 3.413Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgCoin;
