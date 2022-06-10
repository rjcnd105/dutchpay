import type { SVGProps } from 'react'
import * as React from 'react'

const SvgCross = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      clipRule="evenodd"
      d="M17.714 17.714 6.286 6.286l11.428 11.428Z"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M17.714 6.286 6.286 17.714" stroke="#000" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default SvgCross
