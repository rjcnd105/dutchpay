import * as React from 'react';
import { SVGProps } from 'react';
const SvgTrash = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}>
    <path
      clipRule="evenodd"
      d="M6.286 5.143h11.428v13.714a2.286 2.286 0 0 1-2.285 2.286H8.57a2.286 2.286 0 0 1-2.285-2.286V5.143ZM12 2.857c1.205 0 2.192.933 2.28 2.115l.006.17H9.714A2.286 2.286 0 0 1 12 2.858Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 5.143h16M9.714 8.571v9.143M14.286 8.571v9.143"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgTrash;
