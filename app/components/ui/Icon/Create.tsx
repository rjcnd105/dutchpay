import type { SVGProps } from 'react'
import * as React from 'react'

const SvgCreate = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M11.429 5.143H6.286A2.286 2.286 0 0 0 4 7.429v10.286A2.286 2.286 0 0 0 6.286 20h11.428A2.286 2.286 0 0 0 20 17.715v-5.143"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      clipRule="evenodd"
      d="M20 3.962a1.67 1.67 0 0 1-.02 2.343L12 14.285 8.571 15.43 9.714 12 17.7 3.948a1.61 1.61 0 0 1 2.154-.12l.146.134Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="m17.714 6.286 1.09 1.143" stroke="#000" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default SvgCreate
