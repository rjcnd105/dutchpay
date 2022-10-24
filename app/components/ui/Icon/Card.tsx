import * as React from 'react';
import { SVGProps } from 'react';
const SvgCard = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}>
    <path
      clipRule="evenodd"
      d="M5.143 6.286h13.714a2.286 2.286 0 0 1 2.286 2.285v8a2.286 2.286 0 0 1-2.286 2.286H5.143a2.286 2.286 0 0 1-2.286-2.286v-8a2.286 2.286 0 0 1 2.286-2.285Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.286 10.286h19.428v2.285H2.286v-2.285Z"
      fill="#000"
    />
  </svg>
);
export default SvgCard;
