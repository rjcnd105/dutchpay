import * as React from 'react'
import { SVGProps } from 'react'

const SvgCopy = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      clipRule="evenodd"
      d="M16.571 14.286v-8A2.286 2.286 0 0 0 14.286 4h-8A2.286 2.286 0 0 0 4 6.286v8a2.286 2.286 0 0 0 2.286 2.285h8a2.286 2.286 0 0 0 2.285-2.285Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.428 16.571v1.143A2.286 2.286 0 0 0 9.714 20h8A2.286 2.286 0 0 0 20 17.714v-8a2.286 2.286 0 0 0-2.286-2.285h-1.143"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgCopy
